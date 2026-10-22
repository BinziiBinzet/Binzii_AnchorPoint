/**========================================================================
 * ?                  Binzii_AnchorPoint.jsx
 * @author            Binz1 Animation
 * @email             binz1.anima@gmail.com
 * @version           1.0.0
 * @createdFor        EffectCraft
 * @description       Move Anchor Point to selected layer point. Can add and parent a null to the selected layer point.
 * @thankyou          Charles Bordenave (https://www.nabscripts.com) for RepositionAnchorPoint (version: 3.9) and Zack Lovatt (https://lova.tt/) for zl_CreatePivotalNull (version: 1.1) and Eveline Falcão. Special thanks to PivotCraft (EffectCraft contributors, MIT License) — the anchor-point math (2D + 3D bounds & transform compensation) is taken from it.
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
// Even spacing between the three rows so the grid looks like a perfect square
// (horizontal gap == vertical gap == 10px)
panel1.spacing = 10;
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
LT.preferredSize.width = 35;
LT.preferredSize.height = 35;

var CT = group1.add("button", undefined, undefined, {name: "CT"});
CT.text = "\u2191"; // ↑
CT.preferredSize.width = 35;
CT.preferredSize.height = 35;

var RT = group1.add("button", undefined, undefined, {name: "RT"});
RT.text = "\u2197"; // ↗
RT.preferredSize.width = 35;
RT.preferredSize.height = 35;

// GROUP2 - middle row
// ======
var group2 = panel1.add("group", undefined, {name: "group2"});
group2.orientation = "row";
group2.alignChildren = ["left", "center"];
group2.spacing = 10;
group2.margins = 0;

var LL = group2.add("button", undefined, undefined, {name: "LL"});
LL.text = "\u2190"; // ←
LL.preferredSize.width = 35;
LL.preferredSize.height = 35;

var CC = group2.add("button", undefined, undefined, {name: "CC"});
CC.text = "\u2022"; // • (center marker so the middle cell isn't empty)
CC.preferredSize.width = 35;
CC.preferredSize.height = 35;

var RR = group2.add("button", undefined, undefined, {name: "RR"});
RR.text = "\u2192"; // →
RR.preferredSize.width = 35;
RR.preferredSize.height = 35;

// GROUP3 - bottom row
// ======
var group3 = panel1.add("group", undefined, {name: "group3"});
group3.orientation = "row";
group3.alignChildren = ["left", "center"];
group3.spacing = 10;
group3.margins = 0;

var LB = group3.add("button", undefined, undefined, {name: "LB"});
LB.text = "\u2199"; // ↙
LB.preferredSize.width = 35;
LB.preferredSize.height = 35;

var BB = group3.add("button", undefined, undefined, {name: "BB"});
BB.text = "\u2193"; // ↓
BB.preferredSize.width = 35;
BB.preferredSize.height = 35;

var RB = group3.add("button", undefined, undefined, {name: "RB"});
RB.text = "\u2198"; // ↘
RB.preferredSize.width = 35;
RB.preferredSize.height = 35;

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

// ---------------------------------------------------------------------------
// Anchor-point math, taken FULLY from the PivotCraft script (EffectCraft
// contributors, MIT License): sourceRectAtTime bounds + scale/rotation matrix
// compensation (2D and 3D) so the layer never jumps visually when the pivot
// moves. All keyframes are shifted too, including separated dimensions and Z.
// ---------------------------------------------------------------------------

// Bounding box of a layer (also considers layers with masks)
function getLayerBounds(layer) {
    var time = 0;
    try {
        var comp = layer.containingComp || app.project.activeItem;
        if (comp) time = comp.time;
    } catch (e) {}

    var left = 0, top = 0, width = 0, height = 0;

    // First attempt: sourceRectAtTime
    try {
        if (typeof layer.sourceRectAtTime === "function") {
            var rect = layer.sourceRectAtTime(time, false);
            if (rect && rect.width > 0 && rect.height > 0) {
                left = rect.left;
                top = rect.top;
                width = rect.width;
                height = rect.height;
            }
        }
    } catch (e) {}

    // Fallback for solids/footage if sourceRect was empty or zero
    if (width <= 0 || height <= 0) {
        if (layer.width && layer.height) {
            left = 0; top = 0;
            width = layer.width;
            height = layer.height;
        } else {
            left = 0; top = 0;
            width = 100; height = 100;
        }
    }

    return { left: left, top: top, width: width, height: height };
}

// 2D Rotation & Scale Matrix Shift (PivotCraft computeShift2D)
function computeShift2D(deltaA, scale, rotationDeg) {
    var rad = rotationDeg * Math.PI / 180.0;
    var cs = Math.cos(rad);
    var sn = Math.sin(rad);
    var dx = deltaA[0] * (scale[0] / 100.0);
    var dy = deltaA[1] * (scale[1] / 100.0);
    return [
      dx * cs - dy * sn,
      dx * sn + dy * cs,
      0
    ];
}

// 3D Matrix Multiplication & Transformation Shift (PivotCraft computeShift3D)
function computeShift3D(deltaA, scale, orient, rot) {
    var rad = Math.PI / 180.0;
    // Orientation angles: Z, Y, X
    // Rotations: rx, ry, rz
    var ox = orient[0] * rad, oy = orient[1] * rad, oz = orient[2] * rad;
    var rx = rot[0] * rad, ry = rot[1] * rad, rz = rot[2] * rad;

    // Helper to multiply 3x3 matrices
    function m3Mul(a, b) {
      var r = [[0,0,0],[0,0,0],[0,0,0]];
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          r[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j];
        }
      }
      return r;
    }

    function rotX(a) {
      var c = Math.cos(a), s = Math.sin(a);
      return [[1, 0, 0], [0, c, -s], [0, s, c]];
    }
    function rotY(a) {
      var c = Math.cos(a), s = Math.sin(a);
      return [[c, 0, s], [0, 1, 0], [-s, 0, c]];
    }
    function rotZ(a) {
      var c = Math.cos(a), s = Math.sin(a);
      return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
    }

    var mOrient = m3Mul(rotZ(oz), m3Mul(rotY(oy), rotX(ox)));
    var mRot = m3Mul(rotZ(rz), m3Mul(rotY(ry), rotX(rx)));
    var mScale = [
      [scale[0] / 100.0, 0, 0],
      [0, scale[1] / 100.0, 0],
      [0, 0, (scale[2] || 100.0) / 100.0]
    ];

    var linear = m3Mul(mOrient, m3Mul(mRot, mScale));
    return [
      linear[0][0] * deltaA[0] + linear[0][1] * deltaA[1] + linear[0][2] * deltaA[2],
      linear[1][0] * deltaA[0] + linear[1][1] * deltaA[1] + linear[1][2] * deltaA[2],
      linear[2][0] * deltaA[0] + linear[2][1] * deltaA[1] + linear[2][2] * deltaA[2]
    ];
}

// Apply the pivot to one layer using the FULL PivotCraft math (2D + 3D).
function applyPivotToLayer(layer, nx, ny) {
    var is3D = false;
    try { is3D = !!layer.threeDLayer; } catch (e) { is3D = false; }

    var tr = layer.transform;
    if (!tr || !tr.anchorPoint) return false;

    var b = getLayerBounds(layer);

    // Target anchor in layer local space
    var targetX = b.left + b.width * nx;
    var targetY = b.top + b.height * ny;

    var curA = tr.anchorPoint.value;
    var oldAx = curA[0], oldAy = curA[1], oldAz = is3D ? (curA[2] || 0) : 0;
    var targetZ = is3D ? oldAz : 0;
    var delta = [targetX - oldAx, targetY - oldAy, targetZ - oldAz];

    // Compute shift vector to preserve the layer's visible position
    var shift = [0, 0, 0];
    var curScale = tr.scale ? tr.scale.value : [100, 100, 100];
    if (typeof curScale === "number") curScale = [curScale, curScale, 100];
    if (curScale.length === 2) curScale = [curScale[0], curScale[1], 100];
    if (is3D) {
        var orient = tr.orientation ? tr.orientation.value : [0, 0, 0];
        var rx = tr.xRotation ? tr.xRotation.value : 0;
        var ry = tr.yRotation ? tr.yRotation.value : 0;
        var rz = tr.zRotation ? tr.zRotation.value : (tr.rotation ? tr.rotation.value : 0);
        shift = computeShift3D(delta, curScale, orient, [rx, ry, rz]);
    } else {
        var rot = tr.rotation ? tr.rotation.value : 0;
        shift = computeShift2D(delta, curScale, rot);
    }

    // 1. Update Anchor Point (all keyframes if animated)
    var ap = tr.anchorPoint;
    if (ap.numKeys > 0) {
        for (var ak = 1; ak <= ap.numKeys; ak++) {
            var val = ap.keyValue(ak);
            if (is3D) {
                ap.setValueAtKey(ak, [val[0] + delta[0], val[1] + delta[1], (val[2] || 0) + delta[2]]);
            } else {
                ap.setValueAtKey(ak, [val[0] + delta[0], val[1] + delta[1]]);
            }
        }
    } else {
        if (is3D) {
            ap.setValue([targetX, targetY, targetZ]);
        } else {
            ap.setValue([targetX, targetY]);
        }
    }

    // 2. Compensate Position (supports separated dimensions + Z)
    var posProp = tr.position;
    var isSeparated = false;
    try {
        isSeparated = !!(posProp && posProp.dimensionsSeparated);
    } catch (e) {}

    if (isSeparated) {
        var px = tr.xPosition;
        var py = tr.yPosition;
        var pz = is3D ? tr.zPosition : null;

        if (px) {
            if (px.numKeys > 0) {
                for (var kx = 1; kx <= px.numKeys; kx++) px.setValueAtKey(kx, px.keyValue(kx) + shift[0]);
            } else {
                px.setValue(px.value + shift[0]);
            }
        }
        if (py) {
            if (py.numKeys > 0) {
                for (var ky = 1; ky <= py.numKeys; ky++) py.setValueAtKey(ky, py.keyValue(ky) + shift[1]);
            } else {
                py.setValue(py.value + shift[1]);
            }
        }
        if (pz) {
            if (pz.numKeys > 0) {
                for (var kz = 1; kz <= pz.numKeys; kz++) pz.setValueAtKey(kz, pz.keyValue(kz) + shift[2]);
            } else {
                pz.setValue(pz.value + shift[2]);
            }
        }
    } else if (posProp) {
        if (posProp.numKeys > 0) {
            for (var pk = 1; pk <= posProp.numKeys; pk++) {
                var curP = posProp.keyValue(pk);
                if (is3D) {
                    posProp.setValueAtKey(pk, [curP[0] + shift[0], curP[1] + shift[1], (curP[2] || 0) + shift[2]]);
                } else {
                    posProp.setValueAtKey(pk, [curP[0] + shift[0], curP[1] + shift[1]]);
                }
            }
        } else {
            var curPos = posProp.value;
            if (is3D) {
                posProp.setValue([curPos[0] + shift[0], curPos[1] + shift[1], (curPos[2] || 0) + shift[2]]);
            } else {
                posProp.setValue([curPos[0] + shift[0], curPos[1] + shift[1]]);
            }
        }
    }

    return true;
}

// Move the anchor point to the chosen grid position (instant apply).
// fx/fy are fractional coordinates within the bounding box:
//   x: 0 = left edge, 0.5 = center, 1 = right edge
//   y: 0 = top edge,  0.5 = center, 1 = bottom edge
function applyAnchorPoint(fx, fy){
  try {
    var selection = validateSelection();
    if(selection == null) return;
    var layers = selection.layers;

    app.beginUndoGroup("Binzii Anchor Point: Set Anchor Point");
    var count = 0;
    try {
        for(var l = 0; l < layers.length; l++){
            if(applyPivotToLayer(layers[l], fx, fy)) count++;
        }
    } finally {
        app.endUndoGroup();
    }
  } catch(err){
    alert("Binzii Anchor Point: could not move the anchor point - " + err);
  }
}

// Create a null object at the anchor point position of the selected layer(s)
// and automatically parent the layer(s) to it. There is only ONE null button
// now: "Add Null" always creates + parents in one click.
function addNullToLayers(){
  try {
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
  } catch(err){
    try { app.endUndoGroup(); } catch(e2){}
    alert("Binzii Anchor Point: could not add the null - " + err);
  }
}

// Wire the instant-apply handlers. IMPORTANT: every onClick is assigned
// DIRECTLY as a plain function literal (LT.onClick = function(){...}).
// The previous indirection through safeCall() returned a closure that some
// hosts (EffectsCraft) refuse to accept, producing
// "type error: not a callable function" when an arrow button was clicked.
// Error handling lives INSIDE applyAnchorPoint()/addNullToLayers() instead.
LT.onClick = function(){ applyAnchorPoint(0,   0);   };
CT.onClick = function(){ applyAnchorPoint(0.5, 0);   };
RT.onClick = function(){ applyAnchorPoint(1,   0);   };
LL.onClick = function(){ applyAnchorPoint(0,   0.5); };
CC.onClick = function(){ applyAnchorPoint(0.5, 0.5); };
RR.onClick = function(){ applyAnchorPoint(1,   0.5); };
LB.onClick = function(){ applyAnchorPoint(0,   1);   };
BB.onClick = function(){ applyAnchorPoint(0.5, 1);   };
RB.onClick = function(){ applyAnchorPoint(1,   1);   };

// "Add Null" button: creates a null AT the anchor point position and parents
// the selected layer(s) to it in one click.
button1.onClick = function(){
    addNullToLayers();
};
