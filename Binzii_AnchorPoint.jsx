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
            addParentToNullBtn: Button{text: 'Add Parent to Null'},\
        },\
    },\
    bottomRow: Group{orientation: 'row', alignment: ['fill', 'bottom'], alignChildren: ['center', 'center'],\
        autoApply: Checkbox{text: 'Auto Apply'},\
        applyButton: Button{text: 'Apply'}\
    },\
    autoApplyHint: StaticText{text: 'Auto apply anchor point when activated', alignment: ['center', 'top']}\
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
    
    // Check the radio button states
    // Row 1
    for(var c = 0; c < anchorPointGroup.row1.children.length; c++){
        bindEvent(anchorPointGroup.row1.children[c], "onClick", function() {
            for (var i = 0; i < anchorPointGroup.row1.children.length; i++) {
                anchorPointGroup.row2.children[i].value = false;
                anchorPointGroup.row3.children[i].value = false;
            }
        });
    }
    // Row 2
    for(var c = 0; c < anchorPointGroup.row2.children.length; c++){
        bindEvent(anchorPointGroup.row2.children[c], "onClick", function() {
            for (var i = 0; i < anchorPointGroup.row2.children.length; i++) {
                anchorPointGroup.row1.children[i].value = false;
                anchorPointGroup.row3.children[i].value = false;
            }
        });
    }
    // Row 3
    for(var c = 0; c < anchorPointGroup.row3.children.length; c++){
        bindEvent(anchorPointGroup.row3.children[c], "onClick", function() {
            for (var i = 0; i < anchorPointGroup.row3.children.length; i++) {
                anchorPointGroup.row1.children[i].value = false;
                anchorPointGroup.row2.children[i].value = false;
            }
        });
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
    setHelpTip(nullGroup.addNullBtn, "Create a null object at the new anchor point position of the selected layer(s)");
    setHelpTip(nullGroup.addParentToNullBtn, "Create a new null object AND parent the selected layer(s) to it in one click");
    setHelpTip(UI.bottomRow ? UI.bottomRow.autoApply : null, "Automatically apply the anchor point change whenever an anchor point option or offset value changes");
    setHelpTip(UI.applyButton, "Apply the anchor point change to the selected layer(s)");
    setHelpTip(UI.autoApplyHint, "Auto Apply only affects the anchor point (radio buttons and offset fields), not the null buttons");

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

// Move the anchor point only. If doUndo is true, the previous auto-applied
// anchor/position values are restored first so the layer does not shift twice.
function applyAnchorPoint(doUndo){
    var selection = validateSelection();
    if(selection == null) return;
    var comp = selection.comp;
    var layers = selection.layers;

    app.beginUndoGroup("Manipulate Anchor Point");

    // Undo the previous auto-apply (same layer, different settings) before re-applying
    if(doUndo && lastAnchorState != null && lastAnchorState.layer === layers[0]){
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

        var positionTag, newAnchorPositionId;

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

        // Radio button selection
        // Row 1
        if (UI.anchorPointGroup.row1.a.value){
            positionTag = "Top Left";
            newAnchorPositionId = 0;
        } else if (UI.anchorPointGroup.row1.b.value){
            positionTag = "Top Center";
            newAnchorPositionId = 1;
        } else if (UI.anchorPointGroup.row1.c.value){
            positionTag = "Top Right";
            newAnchorPositionId = 2;
        // Row 2
        } else if (UI.anchorPointGroup.row2.a.value){
            positionTag = "Center Left";
            newAnchorPositionId = 3;
        } else if (UI.anchorPointGroup.row2.b.value){
            positionTag = "Center";
            newAnchorPositionId = 4;
        } else if (UI.anchorPointGroup.row2.c.value){
            positionTag = "Center Right";
            newAnchorPositionId = 5;
        // Row 3
        } else if (UI.anchorPointGroup.row3.a.value){
            positionTag = "Bottom Left";
            newAnchorPositionId = 6;
        } else if (UI.anchorPointGroup.row3.b.value){
            positionTag = "Bottom Center";
            newAnchorPositionId = 7;
        } else if (UI.anchorPointGroup.row3.c.value){
            positionTag = "Bottom Right";
            newAnchorPositionId = 8;
        } else {
            positionTag = "Center";
            newAnchorPositionId = 4;
        }

        // Position + Anchor Point workaround - Charles Bordenave's solution is the best I found.
        var anchorGridX = (newAnchorPositionId % 3) - 1;
		var anchorGridY = Math.floor(newAnchorPositionId / 3) - 1;
        var centerWidth = width / 2;
		var centerHeight = height / 2;

        /*
        Anchor Point expression: 
            fromWorld(toWorld([centerWidth, centerHeight, 0] + [(anchorGridX * centerWidth + left + offsetX), (anchorGridY * centerHeight + top + offsetY), offsetZ]));
        */
        anchorPointProp.expression = 
        "fromWorld(toWorld([" + centerWidth + ", " + centerHeight + ", 0] + [(" + anchorGridX + " * " + centerWidth + " + " + left + " + " + offsetX + "), (" + anchorGridY + " * "+ centerHeight + " + " + top + " + " + offsetY + "), " + offsetZ + "]));";
        
        /*
        Position Expression:
            try {
                parent.fromWorld(toWorld([centerWidth, centerHeight, 0] + [(anchorGridX * centerWidth + left + offsetX), (anchorGridY * centerHeight + top + offsetY), offsetZ]));
            }
            catch(e){
                toWorld([centerWidth, centerHeight, 0] + [(anchorGridX * centerWidth + left + offsetX), (anchorGridY * centerHeight + top + offsetY), offsetZ]);
            }
        */
        positionProp.expression =
        "try {\r" +
        "\tparent.fromWorld(toWorld([" + centerWidth + ", " + centerHeight + ", 0] + [(" + anchorGridX + " * " + centerWidth + " + " + left + " + " + offsetX + "), (" + anchorGridY + " * "+ centerHeight + " + " + top + " + " + offsetY + "), " + offsetZ + "]));\r" +
        "}\r" +
        "catch(e){\r" +
        "\ttoWorld([" + centerWidth + ", " + centerHeight + ", 0] + [(" + anchorGridX + " * " + centerWidth + " + " + left + " + " + offsetX + "), (" + anchorGridY + " * " + centerHeight + " + " + top + " + " + offsetY + "), " + offsetZ + "]);\r" +
        "}";

		positionProp.expressionEnabled = false;
		positionProp.expressionEnabled = true;
        var newAnchorValue = anchorPointProp.valueAtTime(currentTime, false);
		anchorPointProp.expression = "";
		var newPositionValue = positionProp.valueAtTime(currentTime, false);
		positionProp.expression = "";
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

// Create a null object at the new anchor point position of the selected layer(s)
function addNullToLayers(autoParent){
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

        // "Add Parent to Null": parent the layer to the newly created null.
        // Because the null shares the layer's world position AND inherits its
        // parent, parenting keeps the layer visually in place (no jump).
        if(autoParent){
            currentLayer.parent = nullCtrl;
        }

        currentLayer.selected = true;
        nullCtrl.selected = false;
    }
    app.endUndoGroup();
}

// Apply button: runs the anchor point move
bindEvent(UI.applyButton, "onClick", function(){
    applyAnchorPoint(true);
});

// Null buttons: independent actions, NOT affected by Auto Apply
// "Add Null" -> creates a null only (no parenting)
// "Add Parent to Null" -> creates a null AND parents the layer(s) to it
bindEvent(UI.extraActionGroup.nullGroup.addNullBtn, "onClick", function(){
    addNullToLayers(false);
});
bindEvent(UI.extraActionGroup.nullGroup.addParentToNullBtn, "onClick", function(){
    addNullToLayers(true);
});

// Auto Apply: re-applies the ANCHOR POINT only (radio buttons + offset fields)
// whenever those controls change while the checkbox is activated.
var autoApplyBoundKey = null;
function bindAutoApply(element){
    bindEvent(element, "onChange", function(){
        if(UI.bottomRow && UI.bottomRow.autoApply && UI.bottomRow.autoApply.value){
            var currentKey = getAnchorStateKey();
            if(autoApplyBoundKey !== currentKey){
                autoApplyBoundKey = currentKey;
                applyAnchorPoint(true);
            }
        }
    });
}

// Anchor point radio buttons (rows 1-3)
for(var r = 1; r <= 3; r++){
    var row = UI.anchorPointGroup['row' + r];
    if(!row) continue;
    for(var c = 0; c < row.children.length; c++){
        bindAutoApply(row.children[c]);
    }
}

// Offset fields
bindAutoApply(UI.offsetAnchorPoint.xText);
bindAutoApply(UI.offsetAnchorPoint.yText);
bindAutoApply(UI.offsetAnchorPoint.zText);
