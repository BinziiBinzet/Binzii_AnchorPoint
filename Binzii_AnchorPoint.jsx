/**========================================================================
 * ?                  Binzii_AnchorPoint.jsx
 * @author            Binz1 Animation
 * @email             binz1.anima@gmail.com
 * @version           1.0.0
 * @createdFor        EffectCraft
 * @description       Move Anchor Point to selected layer point. Can add and parent a null to the selected layer point.
 * @thankyou          Charles Bordenave (https://www.nabscripts.com) for RepositionAnchorPoint (version: 3.9) and Zack Lovatt (https://lova.tt/) for zl_CreatePivotalNull (version: 1.1) and Eveline Falcão.
 *========================================================================**/

var resourceString = 
"group{orientation:'column', alignment: ['left', 'top'], alignChildren: ['left', 'top'],\
    anchorPointGroup: Panel{alignment: ['fill', 'fill'], alignChildren: ['center', 'center'], text: 'Anchor Point',\
        row1: Group{orientation:'row',\
            a: RadioButton{},\
            b: RadioButton{},\
            c: RadioButton{},\
        },\
        row2: Group{orientation:'row',\
            a: RadioButton{},\
            b: RadioButton{},\
            c: RadioButton{},\
        },\
        row3: Group{orientation:'row',\
            a: RadioButton{},\
            b: RadioButton{},\
            c: RadioButton{},\
        },\
    },\
    offsetAnchorPoint: Panel{orientation: 'row', alignment: ['fill', 'fill'], alignChildren: ['center', 'center'], text: 'Offset Point',\
        xLabel: StaticText{text:'X'},\
        xText: EditText{text: '0', characters: 4},\
        yLabel: StaticText{text:'Y'},\
        yText: EditText{text: '0', characters: 4},\
        zLabel: StaticText{text:'Z'},\
        zText: EditText{text: '0', characters: 4}\
    },\
    extraActionGroup: Group{orientation: 'row', alignment: ['fill', 'fill'], alignChildren: ['center', 'top'],\
        nullGroup: Group{orientation: 'column', alignChildren: ['left', 'top'],\
            addNullBtn: Button{text: 'Add Null'},\
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
    var offsetAnchorPoint = UI.offsetAnchorPoint;
    var nullGroup = UI.extraActionGroup.nullGroup;
    
    // Radio exclusivity across the 3x3 grid. The actual anchor point move is
    // triggered later (in applyAnchorPointOnControlChange) as soon as a radio
    // is clicked - there is no Apply button anymore.
    function clearOtherRows(clickedRow){
        for(var r = 1; r <= 3; r++){
            if(r === clickedRow) continue;
            var row = anchorPointGroup['row' + r];
            if(!row) continue;
            for(var i = 0; i < row.children.length; i++){
                row.children[i].value = false;
            }
        }
    }
    for(var r = 1; r <= 3; r++){
        (function(rowIdx){
            var row = anchorPointGroup['row' + rowIdx];
            if(!row) return;
            for(var c = 0; c < row.children.length; c++){
                bindEvent(row.children[c], "onClick", function() {
                    clearOtherRows(rowIdx);
                });
            }
        })(r);
    }

    // Default state for the offset value
    bindEvent(offsetAnchorPoint.xText, "onChange", function(){
        var xVal = parseFloat(offsetAnchorPoint.xText.text);
        if(isNaN(xVal)){
            offsetAnchorPoint.xText.text = 0;
        }
    });
    bindEvent(offsetAnchorPoint.yText, "onChange", function(){
        var yVal = parseFloat(offsetAnchorPoint.yText.text);
        if(isNaN(yVal)){
            offsetAnchorPoint.yText.text = 0;
        }
    });
    bindEvent(offsetAnchorPoint.zText, "onChange", function(){
        var zVal = parseFloat(offsetAnchorPoint.zText.text);
        if(isNaN(zVal)){
            offsetAnchorPoint.zText.text = 0;
        }
    });

    var tooltipGrid = ["Top Left", "Top Center", "Top Right", "Center Left", "Center", "Center Right", "Bottom Left", "Bottom Center", "Bottom Right"];
    setHelpTip(anchorPointGroup, "Choose where to move the anchor point");
    for(var r = 1; r <= 3; r++){
        var row = anchorPointGroup['row' + r];
        if(!row) continue;
        for(var c = 0; c < row.children.length; c++){
            setHelpTip(row.children[c], "Set anchor point to " + tooltipGrid[(r - 1) * 3 + c] + " of the layer");
        }
    }
    setHelpTip(offsetAnchorPoint, "Offset the anchor point position by X, Y and Z values (in pixels)");
    setHelpTip(offsetAnchorPoint.xText, "Horizontal offset (X) in pixels");
    setHelpTip(offsetAnchorPoint.yText, "Vertical offset (Y) in pixels");
    setHelpTip(offsetAnchorPoint.zText, "Depth offset (Z) in pixels (for 3D layers)");
    setHelpTip(nullGroup.addNullBtn, "Create a null object at the anchor point position of the selected layer(s) and automatically parent the layer(s) to it");

    // Default state for the radio selection
    anchorPointGroup.row2.b.value = true;

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

var lastAnchorState = null; // { key: "x|y|z|radio", layer: layerRef, positionValue, anchorValue }

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

// Build a unique key for the current anchor point controls state
function getAnchorStateKey(){
    var selRadio = "";
    for(var r = 1; r <= 3; r++){
        var row = UI.anchorPointGroup['row' + r];
        for(var c = 0; c < row.children.length; c++){
            if(row.children[c].value){
                selRadio = "row" + r + "." + row.children[c].text;
            }
        }
    }
    return [
        UI.offsetAnchorPoint.xText.text,
        UI.offsetAnchorPoint.yText.text,
        UI.offsetAnchorPoint.zText.text,
        selRadio
    ].join("|");
}

// Move the anchor point. The previous auto-applied anchor/position values are
// restored first so switching options repeatedly does not stack offsets or
// make the layer shift twice.
function applyAnchorPoint(){
    var selection = validateSelection();
    if(selection == null) return;
    var comp = selection.comp;
    var layers = selection.layers;

    app.beginUndoGroup("Manipulate Anchor Point");

    // Undo the previous apply (same layer, different settings) before re-applying
    if(lastAnchorState != null && lastAnchorState.layer === layers[0]){
        try {
            lastAnchorState.layer.property("ADBE Transform Group").property("ADBE Position").setValue(lastAnchorState.positionValue);
            lastAnchorState.layer.property("ADBE Transform Group").property("ADBE Anchor Point").setValue(lastAnchorState.anchorValue);
        } catch(e){}
    }

    for(var l = 0; l < layers.length; l++){
        var currentLayer = layers[l];
        var currentTime = comp.time;
        var positionProp = currentLayer.property("ADBE Transform Group").property("ADBE Position");
        var anchorPointProp = currentLayer.property("ADBE Transform Group").property("ADBE Anchor Point");

        var initialPositionValue = positionProp.value;
        var initialAnchorValue = anchorPointProp.value;

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

        // Add the "Offset Anchor Point" value
        var offsetX = parseFloat(UI.offsetAnchorPoint.xText.text);
        var offsetY = parseFloat(UI.offsetAnchorPoint.yText.text);
        var offsetZ = parseFloat(UI.offsetAnchorPoint.zText.text);
        if(isNaN(offsetX)) offsetX = 0;
        if(isNaN(offsetY)) offsetY = 0;
        if(isNaN(offsetZ)) offsetZ = 0;

        // Radio button selection - compute the target point directly in the
        // layer's own coordinate system (same math as the original upstream
        // script). This does NOT rely on toWorld()/fromWorld() expressions,
        // which are unsupported/unreliable in EffectsCraft and made the
        // anchor point move silently fail.
        var newAnchorValue;
        if (UI.anchorPointGroup.row1.a.value){
            newAnchorValue = [left + offsetX, top + offsetY, offsetZ];
        } else if (UI.anchorPointGroup.row1.b.value){
            newAnchorValue = [(left + width / 2) + offsetX, top + offsetY, offsetZ];
        } else if (UI.anchorPointGroup.row1.c.value){
            newAnchorValue = [(left + width) + offsetX, top + offsetY, offsetZ];
        } else if (UI.anchorPointGroup.row2.a.value){
            newAnchorValue = [left + offsetX, (top + height / 2) + offsetY, offsetZ];
        } else if (UI.anchorPointGroup.row2.b.value){
            newAnchorValue = [(left + width / 2) + offsetX, (top + height / 2) + offsetY, offsetZ];
        } else if (UI.anchorPointGroup.row2.c.value){
            newAnchorValue = [(left + width) + offsetX, (top + height / 2) + offsetY, offsetZ];
        } else if (UI.anchorPointGroup.row3.a.value){
            newAnchorValue = [left + offsetX, (top + height) + offsetY, offsetZ];
        } else if (UI.anchorPointGroup.row3.b.value){
            newAnchorValue = [(left + width / 2) + offsetX, (top + height) + offsetY, offsetZ];
        } else if (UI.anchorPointGroup.row3.c.value){
            newAnchorValue = [(left + width) + offsetX, (top + height) + offsetY, offsetZ];
        } else {
            newAnchorValue = [(left + width / 2) + offsetX, (top + height / 2) + offsetY, offsetZ];
        }

        // Keep the layer visually in place: when the anchor moves by delta,
        // the position must move by the same delta (in layer space).
        var positionDelta = [
            newAnchorValue[0] - initialAnchorValue[0],
            newAnchorValue[1] - initialAnchorValue[1],
            newAnchorValue[2] - initialAnchorValue[2]
        ];
        var newPositionValue = [
            initialPositionValue[0] + positionDelta[0],
            initialPositionValue[1] + positionDelta[1],
            initialPositionValue[2] + positionDelta[2]
        ];

        setPropertyValue(comp, positionProp, newPositionValue);
        setPropertyValue(comp, anchorPointProp, newAnchorValue);

        // Remember applied state so Auto Apply can undo-then-redo on the same layer
        lastAnchorState = {
            key: getAnchorStateKey(),
            layer: layers[0],
            positionValue: initialPositionValue,
            anchorValue: initialAnchorValue
        };
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

// Immediate apply: whenever an anchor point radio button or an offset field
// changes, the anchor point is applied right away (no Apply button / Auto
// Apply checkbox anymore). Guarded so it only runs once per state change.
var lastAppliedKey = null;
function applyAnchorPointOnControlChange(){
    var currentKey = getAnchorStateKey();
    if(lastAppliedKey === currentKey) return; // already applied with these settings
    lastAppliedKey = currentKey;
    applyAnchorPoint();
}

// Anchor point radio buttons (rows 1-3): onClick fires immediately after the
// host-side exclusivity handler clears the other rows.
for(var r = 1; r <= 3; r++){
    var row = UI.anchorPointGroup['row' + r];
    if(!row) continue;
    for(var c = 0; c < row.children.length; c++){
        bindEvent(row.children[c], "onClick", function(){
            applyAnchorPointOnControlChange();
        });
    }
}

// Offset fields: apply when the value changes (on Enter / focus loss)
bindEvent(UI.offsetAnchorPoint.xText, "onChange", function(){
    applyAnchorPointOnControlChange();
});
bindEvent(UI.offsetAnchorPoint.yText, "onChange", function(){
    applyAnchorPointOnControlChange();
});
bindEvent(UI.offsetAnchorPoint.zText, "onChange", function(){
    applyAnchorPointOnControlChange();
});
