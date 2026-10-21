/**========================================================================
 * ?                  Binzii_AnchorPoint.jsx
 * @author            Binz1 Animation
 * @email             binz1.anima@gmail.com
 * @version           1.0.0
 * @createdFor        EffectCraft
 * @description       Move Anchor Point to selected layer point. Can add and parent a null to the selected layer point.
 * @thankyou          Charles Bordenave (https://www.nabscripts.com) for RepositionAnchorPoint (version: 3.9) and Zack Lovatt (https://lova.tt/) for zl_CreatePivotalNull (version: 1.1) and Eveline Falcão.
 *========================================================================**/

var panelGlobal = this;

/*
UI built with the ScriptUI JSON-import pattern from https://scriptui.joonas.me
A Panel wraps the 3x3 grid of arrow buttons so the whole group is centered
inside the palette, and the "Add Null" button sits below it.
*/

// WIN
// ===
var win = (panelGlobal instanceof Panel) ? panelGlobal : new Window("palette", undefined, undefined, {resizeable: true});
if (win == null) {
    alert("Binzii_AnchorPoint: could not create the panel UI in this host.");
}
if (!(panelGlobal instanceof Panel)) win.text = "Binzii Anchor Point";
win.orientation = "column";
win.alignChildren = ["center", "center"];
win.spacing = 12;
win.margins = 16;

// PANEL1
// ======
var panel1 = win.add("panel", undefined, undefined, {name: "panel1"});
panel1.orientation = "column";
panel1.alignChildren = ["center", "center"];
panel1.spacing = 0;
panel1.margins = 10;

// GROUP1 - top row
// ======
var group1 = panel1.add("group", undefined, {name: "group1"});
group1.orientation = "row";
group1.alignChildren = ["left", "center"];
group1.spacing = 10;
group1.margins = 0;

var LT = group1.add("button", undefined, undefined, {name: "LT"});
LT.text = "\u2196"; // ↖
LT.preferredSize.width = 25;
LT.preferredSize.height = 25;

var CT = group1.add("button", undefined, undefined, {name: "CT"});
CT.text = "\u2191"; // ↑
CT.preferredSize.width = 25;
CT.preferredSize.height = 25;

var RT = group1.add("button", undefined, undefined, {name: "RT"});
RT.text = "\u2197"; // ↗
RT.preferredSize.width = 25;
RT.preferredSize.height = 25;

// GROUP2 - middle row
// ======
var group2 = panel1.add("group", undefined, {name: "group2"});
group2.orientation = "row";
group2.alignChildren = ["left", "center"];
group2.spacing = 10;
group2.margins = 0;

var LL = group2.add("button", undefined, undefined, {name: "LL"});
LL.text = "\u2190"; // ←
LL.preferredSize.width = 25;
LL.preferredSize.height = 25;

var CC = group2.add("button", undefined, undefined, {name: "CC"});
CC.text = "\u2022"; // • (center marker so the middle cell isn't empty)
CC.preferredSize.width = 25;
CC.preferredSize.height = 25;

var RR = group2.add("button", undefined, undefined, {name: "RR"});
RR.text = "\u2192"; // →
RR.preferredSize.width = 25;
RR.preferredSize.height = 25;

// GROUP3 - bottom row
// ======
var group3 = panel1.add("group", undefined, {name: "group3"});
group3.orientation = "row";
group3.alignChildren = ["left", "center"];
group3.spacing = 10;
group3.margins = 0;

var LB = group3.add("button", undefined, undefined, {name: "LB"});
LB.text = "\u2199"; // ↙
LB.preferredSize.width = 25;
LB.preferredSize.height = 25;

var BB = group3.add("button", undefined, undefined, {name: "BB"});
BB.text = "\u2193"; // ↓
BB.preferredSize.width = 25;
BB.preferredSize.height = 25;

var RB = group3.add("button", undefined, undefined, {name: "RB"});
RB.text = "\u2198"; // ↘
RB.preferredSize.width = 25;
RB.preferredSize.height = 25;

// ADD NULL BUTTON
// ===============
var button1 = win.add("button", undefined, undefined, {name: "button1"});
button1.text = "Add Null";

// LAYOUT
// ======
try {
    win.layout.layout(true);
    win.layout.resize();
} catch(e) { /* layout not supported the same way in this host - ignore */ }
win.onResizing = win.onResize = function () { try { this.layout.resize(); } catch(e){} };

if (win instanceof Window) win.show();

// ---------------------------------------------------------------------------
// Host-safe helpers.
// Some ScriptUI hosts (e.g. EffectsCraft) do not support every ScriptUI
// property (like helpTip). Assigning on a missing element can throw
// "cannot convert null or undefined to object", so all assignments below
// go through these guarded helpers.
// ---------------------------------------------------------------------------
function setHelpTip(element, tip){
    try {
        if(element){ element.helpTip = tip; }
    } catch(e){ /* host does not support helpTip - ignore */ }
}

// Direct onClick assignment (ScriptUI standard). The previous generic
// element[event] = handler indirection caused "not a callable function"
// on some hosts, so handlers are now assigned directly below instead.
function safeCall(fn){
    return function(){
        try { fn(); } catch(err){ alert("Binzii_AnchorPoint: " + err); }
    };
}

// Tooltips for every control
setHelpTip(panel1, "Click an arrow to instantly move the anchor point there");
setHelpTip(LT, "Move anchor point to Top Left of the layer (applies instantly)");
setHelpTip(CT, "Move anchor point to Top Center of the layer (applies instantly)");
setHelpTip(RT, "Move anchor point to Top Right of the layer (applies instantly)");
setHelpTip(LL, "Move anchor point to Center Left of the layer (applies instantly)");
setHelpTip(CC, "Move anchor point to Center of the layer (applies instantly)");
setHelpTip(RR, "Move anchor point to Center Right of the layer (applies instantly)");
setHelpTip(LB, "Move anchor point to Bottom Left of the layer (applies instantly)");
setHelpTip(BB, "Move anchor point to Bottom Center of the layer (applies instantly)");
setHelpTip(RB, "Move anchor point to Bottom Right of the layer (applies instantly)");
setHelpTip(button1, "Create a null object at the anchor point position of the selected layer(s) and automatically parent the layer(s) to it");

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

// Move the anchor point to the chosen grid position. Each click computes
// the target from the CURRENT bounding box, so switching positions never
// stacks deltas - the layer always ends up visually in place with the anchor
// at the chosen corner/edge/center.
// fx/fy are fractional coordinates within the bounding box:
//   x: 0 = left edge, 0.5 = center, 1 = right edge
//   y: 0 = top edge,  0.5 = center, 1 = bottom edge
function applyAnchorPoint(fx, fy){
    var selection = validateSelection();
    if(selection == null) return;
    var comp = selection.comp;
    var layers = selection.layers;

    app.beginUndoGroup("Manipulate Anchor Point");

    for(var l = 0; l < layers.length; l++){
        var currentLayer = layers[l];
        var positionProp = currentLayer.property("ADBE Transform Group").property("ADBE Position");
        var anchorPointProp = currentLayer.property("ADBE Transform Group").property("ADBE Anchor Point");

        // Bounding box
        var sourceRect = getBoundingBox(currentLayer);
        var top = sourceRect.top;
        var left = sourceRect.left;
        var width = sourceRect.width;
        var height = sourceRect.height;

        // Target point in layer space
        var tx = left + width * fx;
        var ty = top + height * fy;

        // Check if layer has any expression in the Anchor Point
        if(anchorPointProp.expressionEnabled){
            anchorPointProp.expression = "";
        }

        var newAnchorValue;
        if(currentLayer.threeDLayer){
            // ---- 3D layers ----
            // The naive "position += anchor delta" trick breaks once a 3D
            // layer is rotated: the anchor delta lives in the layer's OWN
            // (rotated) coordinate system, so the layer visibly slides along
            // its rotated axes. Fix: do the correction in WORLD space instead.
            //   1. remember where the OLD anchor sits in world space,
            //   2. set the new anchor,
            //   3. with the new anchor, the chosen point (tx, ty) IS rendered
            //      at the layer's Position - find where that lands in world
            //      space via toWorld(),
            //   4. shift Position by the world-space correction vector so the
            //      chosen point lands exactly where the old anchor was.
            // Result: the layer never jumps visually, even when rotated.
            var oldAnchorWorld = currentLayer.toWorld(anchorPointProp.value);

            var newA3D = [tx, ty];
            if(anchorPointProp.value.length > 2){ newA3D.push(anchorPointProp.value[2]); }
            setPropertyValue(comp, anchorPointProp, newA3D);

            var targetWorld = currentLayer.toWorld([tx, ty]);
            var curPos = positionProp.value;
            var corrected = [];
            for(var d3 = 0; d3 < curPos.length; d3++){
                var corr = (d3 < 3) ? (oldAnchorWorld[d3] - targetWorld[d3]) : 0;
                corrected.push(curPos[d3] + corr);
            }
            setPropertyValue(comp, positionProp, corrected);
            continue; // 3D path fully handles this layer (undo group still open)
        } else {
            newAnchorValue = [tx, ty];
        }

        // ---- 2D layers ----
        // Keep the layer visually in place: when the anchor moves by delta,
        // the position must move by the same delta (in layer space).
        var initialPositionValue2D = positionProp.value;
        var initialAnchorValue2D = anchorPointProp.value;
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

// Wire the instant-apply handlers: clicking an arrow immediately moves the
// anchor point to that position (buttons have no persistent state, so there
// is nothing to multi-select - each click just applies its own position).
if (LT) LT.onClick = safeCall(function(){ applyAnchorPoint(0,   0);   });
if (CT) CT.onClick = safeCall(function(){ applyAnchorPoint(0.5, 0);   });
if (RT) RT.onClick = safeCall(function(){ applyAnchorPoint(1,   0);   });
if (LL) LL.onClick = safeCall(function(){ applyAnchorPoint(0,   0.5); });
if (CC) CC.onClick = safeCall(function(){ applyAnchorPoint(0.5, 0.5); });
if (RR) RR.onClick = safeCall(function(){ applyAnchorPoint(1,   0.5); });
if (LB) LB.onClick = safeCall(function(){ applyAnchorPoint(0,   1);   });
if (BB) BB.onClick = safeCall(function(){ applyAnchorPoint(0.5, 1);   });
if (RB) RB.onClick = safeCall(function(){ applyAnchorPoint(1,   1);   });

// "Add Null" button: creates a null AT the anchor point position and parents
// the selected layer(s) to it in one click.
if (button1) button1.onClick = safeCall(function(){
    addNullToLayers();
});
