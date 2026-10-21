/**========================================================================
 * ?                  Binzii_AnchorPoint.jsx
 * @author            Binz1 Animation
 * @email             binz1.anima@gmail.com
 * @version           1.0.0
 * @createdFor        EffectCraft
 * @description       Move Anchor Point to selected layer point. Can add and parent a null to the selected layer point.
 * @thankyou          Charles Bordenave (https://www.nabscripts.com) for RepositionAnchorPoint (version: 3.9) and Zack Lovatt (https://lova.tt/) for zl_CreatePivotalNull (version: 1.1) and Eveline Falcão.
 *========================================================================**/

// 3x3 grid of unlabeled square buttons. Clicking a cell immediately applies
// that anchor point. Exclusivity is handled in code (pressing one cell
// releases all others), so multiple cells can never be active at once.
var resourceString =
"group{orientation:'column', alignment: ['fill', 'fill'], alignChildren: ['center', 'top'],\
    anchorPointGroup: Group{orientation:'column', alignment: ['fill', 'fill'], alignChildren: ['center', 'center'], spacing: 4,\
        row1: Group{orientation:'row', alignment: ['fill', 'fill'], alignChildren: ['center', 'center'], spacing: 4,\
            a: Button{preferredSize: [30, 30]},\
            b: Button{preferredSize: [30, 30]},\
            c: Button{preferredSize: [30, 30]},\
        },\
        row2: Group{orientation:'row', alignment: ['fill', 'fill'], alignChildren: ['center', 'center'], spacing: 4,\
            a: Button{preferredSize: [30, 30]},\
            b: Button{preferredSize: [30, 30]},\
            c: Button{preferredSize: [30, 30]},\
        },\
        row3: Group{orientation:'row', alignment: ['fill', 'fill'], alignChildren: ['center', 'center'], spacing: 4,\
            a: Button{preferredSize: [30, 30]},\
            b: Button{preferredSize: [30, 30]},\
            c: Button{preferredSize: [30, 30]},\
        },\
    },\
    extraActionGroup: Group{orientation: 'column', alignment: ['fill', 'fill'], alignChildren: ['center', 'top'],\
        nullGroup: Group{orientation: 'column', alignChildren: ['center', 'top'],\
            addNullBtn: Button{text: 'Add Null', preferredSize: [-1, 28]},\
        },\
    }\
}"

// ---------------------------------------------------------------------------
// Host-safe helpers.
// Some ScriptUI hosts (e.g. EffectsCraft) do not build every UI element the
// same way After Effects does. Directly assigning properties like helpTip or
// onClick on an element that is missing/null throws:
//   "cannot convert null or undefined to object"
// So ALL UI property assignments below go through these guarded helpers.
// ---------------------------------------------------------------------------
function setHelpTip(element, tip){
    try {
        if(element){ element.helpTip = tip; }
    } catch(e){ /* host does not support helpTip - ignore */ }
}

function bindEvent(element, event, handler){
    try {
        if(element){ element[event] = handler; }
    } catch(e){ /* not supported by this host - ignore */ }
}

function createUserInterface(thisObj, userInterfaceString, scriptName){

    var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, undefined, {resizeable: true});
    if (pal == null) return pal;

    var UI = pal.add(userInterfaceString);

    try {
        pal.layout.layout(true);
        pal.layout.resize();
    } catch(e){ /* layout not supported the same way in this host - ignore */ }
    bindEvent(pal, "onResizing", function(){
        try { this.layout.resize(); } catch(e){}
    });
    bindEvent(pal, "onResize", function(){
        try { this.layout.resize(); } catch(e){}
    });
    if ((pal != null) && (pal instanceof Window)){
        pal.show();
    }

    var anchorPointGroup = UI.anchorPointGroup;
    var nullGroup = UI.extraActionGroup.nullGroup;
    
    // The 3x3 grid is made of plain (unlabeled) Buttons. ScriptUI buttons have
    // no persistent "checked" state, so the selected cell is tracked in a
    // variable: clicking a cell makes it THE active cell (all others revert to
    // their normal look automatically) and applies the anchor point right away.
    // Multi-select is therefore impossible by design.
    var tooltipGrid = ["Top Left", "Top Center", "Top Right", "Center Left", "Center", "Center Right", "Bottom Left", "Bottom Center", "Bottom Right"];

    function highlightActiveCell(activeRow, activeCol){
        for(var r = 1; r <= 3; r++){
            var row = anchorPointGroup['row' + r];
            if(!row) continue;
            for(var i = 0; i < row.children.length; i++){
                try {
                    if(r === activeRow && i === activeCol){
                        row.children[i].notify("onDraw"); // repaint pressed/active look where supported
                    }
                } catch(e){}
            }
        }
    }

    setHelpTip(anchorPointGroup, "Click a position to instantly move the anchor point there");
    for(var r = 1; r <= 3; r++){
        (function(rowIdx){
            var row = anchorPointGroup['row' + rowIdx];
            if(!row) return;
            for(var c = 0; c < row.children.length; c++){
                (function(colIdx){
                    var label = tooltipGrid[(rowIdx - 1) * 3 + colIdx];
                    setHelpTip(row.children[colIdx], "Move anchor point to " + label + " of the layer (applies instantly)");
                    bindEvent(row.children[colIdx], "onClick", function() {
                        window.selectedAnchorRow = rowIdx;
                        window.selectedAnchorCol = colIdx;
                        highlightActiveCell(rowIdx, colIdx);
                        applyAnchorPoint();
                    });
                })(c);
            }
        })(r);
    }

    setHelpTip(nullGroup.addNullBtn, "Create a null object at the anchor point position of the selected layer(s) and automatically parent the layer(s) to it");

    return UI;
}

var UI = createUserInterface(this, resourceString, "Binzii Anchor Point");

// If the panel could not be created (or the host failed to build it), stop here
// with a clear message instead of crashing later on undefined/null references.
if(!UI){
    alert("Binzii_AnchorPoint: could not create the panel UI in this host.");
}

// Reset rotation
function setPropertyValue(comp, property, value){
    // Function inspired by zl_CreatePivotalNull_setKeys
    var currentTime = comp.time;
    if(property.isTimeVarying){
        var nearestKeyframeIndex = property.nearestKeyIndex(currentTime);
        property.setValueAtKey(nearestKeyframeIndex, value);
    } else {
        property.setValue(value);
    }
}

// Bounding Box, also considers layers with masks
function getBoundingBox(layer) {
    var comp = layer.containingComp;
    var currentTime = comp.time;
    var boundingBox = {};

    if (layer.Masks.numProperties) {
        var maskGroup = layer.Masks;
        var top = Infinity, bottom = -Infinity, left = Infinity, right = -Infinity;
        var numMasks = maskGroup.numProperties;

        for (var mask = 1; mask <= numMasks; mask++) {
            var maskShape = maskGroup.property(mask).maskShape;
            var shape = maskShape.valueAtTime(currentTime, false);
            var verts = shape.vertices;
            var inTangents = shape.inTangents;
            var outTangents = shape.outTangents;

            for (var i = 0; i < verts.length; i++) {
                var vx = verts[i][0];
                var vy = verts[i][1];
                var inX = vx + inTangents[i][0];
                var inY = vy + inTangents[i][1];
                var outX = vx + outTangents[i][0];
                var outY = vy + outTangents[i][1];

                left = Math.min(left, vx, inX, outX);
                right = Math.max(right, vx, inX, outX);
                top = Math.min(top, vy, inY, outY);
                bottom = Math.max(bottom, vy, inY, outY);
            }
            
            boundingBox.width = right - left;
            boundingBox.height = bottom - top;
            boundingBox.left = left;
            boundingBox.top = top;
        }
    } else {
        var sourceRect = layer.sourceRectAtTime(currentTime, true);
        boundingBox.width = sourceRect.width;
        boundingBox.height = sourceRect.height;
        boundingBox.left = sourceRect.left;
        boundingBox.top = sourceRect.top;
    }

    return boundingBox;
}

// Guard against runtime errors (e.g. no comp / no layer selected)
function validateSelection(){
    var comp = app.project.activeItem;
    if(!(comp && comp instanceof CompItem)){
        alert("Please open and select a composition first.");
        return null;
    }
    var layers = comp.selectedLayers;
    if(layers.length === 0){
        alert("Please select at least one layer.");
        return null;
    }
    return { comp: comp, layers: layers };
}

// Which grid cell is currently active (tracked when a button is clicked).
// Defaults to Center so the very first click always has a valid state.
window.selectedAnchorRow = 2;
window.selectedAnchorCol = 1;

// Move the anchor point to the selected grid position. Each click computes
// the target from the CURRENT bounding box, so switching positions never
// stacks deltas - the layer always ends up visually in place with the anchor
// at the chosen corner/edge/center.
function applyAnchorPoint(){
    var selection = validateSelection();
    if(selection == null) return;
    var comp = selection.comp;
    var layers = selection.layers;

    app.beginUndoGroup("Manipulate Anchor Point");

    for(var l = 0; l < layers.length; l++){
        var currentLayer = layers[l];
        var currentTime = comp.time;
        var positionProp = currentLayer.property("ADBE Transform Group").property("ADBE Position");
        var anchorPointProp = currentLayer.property("ADBE Transform Group").property("ADBE Anchor Point");

        // Bounding box
        var sourceRect = getBoundingBox(currentLayer);
        var top = sourceRect.top;
        var left = sourceRect.left;
        var width = sourceRect.width;
        var height = sourceRect.height;

        // Check if layer has any expression in the Anchor Point
        if(anchorPointProp.expressionEnabled){
            anchorPointProp.expression = "";
        }

        // Grid selection: which cell is active (tracked on click). Compute the
        // target corner/edge/center of the bounding box in LAYER space.
        var selRow = window.selectedAnchorRow || 2;
        var selCol = (window.selectedAnchorCol === undefined) ? 1 : window.selectedAnchorCol;

        var fx, fy; // fractional position within the bounding box
        if(selCol === 0)      fx = left;
        else if(selCol === 1) fx = left + width / 2;
        else                  fx = left + width;

        if(selRow === 1)      fy = top;
        else if(selRow === 2) fy = top + height / 2;
        else                  fy = top + height;

        var newAnchorValue;
        if(currentLayer.threeDLayer){
            // ---- 3D layers ----
            // The naive "position += anchor delta" trick breaks once a 3D
            // layer is rotated: the anchor delta lives in the layer's OWN
            // (rotated) coordinate system, so the layer visibly slides along
            // its rotated axes. Fix: do the correction in WORLD space instead.
            //   1. remember where the OLD anchor sits in world space,
            //   2. set the new anchor,
            //   3. with the new anchor, the chosen point (fx, fy) IS rendered
            //      at the layer's Position - find where that lands in world
            //      space via toWorld(),
            //   4. shift Position by the world-space correction vector so the
            //      chosen point lands exactly where the old anchor was.
            // Result: the layer never jumps visually, even when rotated.
            var oldAnchorWorld = currentLayer.toWorld(anchorPointProp.value);

            var newA3D = [fx, fy];
            if(anchorPointProp.value.length > 2){ newA3D.push(anchorPointProp.value[2]); }
            setPropertyValue(comp, anchorPointProp, newA3D);

            var targetWorld = currentLayer.toWorld([fx, fy]);
            var curPos = positionProp.value;
            var corrected = [];
            for(var d3 = 0; d3 < curPos.length; d3++){
                var corr = (d3 < 3) ? (oldAnchorWorld[d3] - targetWorld[d3]) : 0;
                corrected.push(curPos[d3] + corr);
            }
            setPropertyValue(comp, positionProp, corrected);
            continue; // 3D path fully handles this layer (undo group still open)
        } else {
            newAnchorValue = [fx, fy];
        }

        // ---- 2D layers ----
        // Keep the layer visually in place: when the anchor moves by delta,
        // the position must move by the same delta (in layer space).
        var initialPositionValue2D = currentLayer.property("ADBE Transform Group").property("ADBE Position").value;
        var initialAnchorValue2D = currentLayer.property("ADBE Transform Group").property("ADBE Anchor Point").value;
        var dims = Math.max(newAnchorValue.length, initialAnchorValue2D.length, initialPositionValue2D.length);
        var newPositionValue = [];
        for(var d = 0; d < dims; d++){
            var na = (d < newAnchorValue.length) ? newAnchorValue[d] : 0;
            var ia = (d < initialAnchorValue2D.length) ? initialAnchorValue2D[d] : 0;
            var ip = (d < initialPositionValue2D.length) ? initialPositionValue2D[d] : 0;
            newPositionValue.push(ip + (na - ia));
        }
        if(newAnchorValue.length < dims){
            var padded = newAnchorValue.slice();
            while(padded.length < dims) padded.push(0);
            newAnchorValue = padded;
        }

        setPropertyValue(comp, positionProp, newPositionValue);
        setPropertyValue(comp, anchorPointProp, newAnchorValue);
    }
    app.endUndoGroup();
}

// Create a null object at the anchor point position of the selected layer(s)
// and automatically parent the layer(s) to it. There is only ONE null button
// now: "Add Null" always creates + parents in one click.
function addNullToLayers(){
    var selection = validateSelection();
    if(selection == null) return;
    var comp = selection.comp;
    var layers = selection.layers;

    app.beginUndoGroup("Add Null at Anchor Point");

    for(var l = 0; l < layers.length; l++){
        var currentLayer = layers[l];
        var positionProp = currentLayer.property("ADBE Transform Group").property("ADBE Position");
        var newPositionValue = positionProp.value;

        var nullCtrl = comp.layers.addNull();
        nullCtrl.name = "Null - " + currentLayer.name;
        nullCtrl.moveBefore(currentLayer); // Move created null before currentLayer

        nullCtrl.parent = currentLayer.parent; // If layer has a parent, the nullCtrl parent will be set between the layer and its parent
        nullCtrl.threeDLayer = currentLayer.threeDLayer; // If current layer is threeD (true), nullCtrl is threeD (true) and vice versa

        var nullCtrlProps = nullCtrl.property("ADBE Transform Group");
        var nullPositionProp = nullCtrlProps.property("ADBE Position");
        setPropertyValue(comp, nullPositionProp, newPositionValue);

        // Parent the layer to the newly created null. Because the null shares
        // the layer's world position AND inherits its parent, parenting keeps
        // the layer visually in place (no jump).
        currentLayer.parent = nullCtrl;

        currentLayer.selected = true;
        nullCtrl.selected = false;
    }
    app.endUndoGroup();
}

// "Add Null" button: creates a null AT the anchor point position and parents
// the selected layer(s) to it in one click.
bindEvent(UI.extraActionGroup.nullGroup.addNullBtn, "onClick", function(){
    addNullToLayers();
});
