/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.

 * ***************************************************************************

    In this file we extend the standard Blockly library with application-specific functionality
    that seems to be core enough to become core extension.
 */


/**
 * Returns the list of all blocks currently inserted&chained into a slot specified by slotName.
 *
 * It is way easier to iterate this way (just one call, and you always get a list, even if empty).
 */
Blockly.Block.prototype.getSlotContentsList = function(slotName) {
    var slotContentsList = [];

    var next = this.getInputTargetBlock(slotName);

    while(next) {
        slotContentsList.push( next );
        next = next.getNextBlock();
    }

    return slotContentsList;
};


/**
 * Returns the list of all statement inputs (slots) available in a block.
 */
Blockly.Block.prototype.getStatementInputNames = function() {
    var statementInputNames = [];

    for (var i = 0, input; input = this.inputList[i]; i++) {
        if(input.type == Blockly.NEXT_STATEMENT) {
            statementInputNames.push(input.name);
        }
    }

    return statementInputNames;
}


//function to toggle hide/show optiFields
function optiField_setter(newState) {
	var checkBoxFieldName   = this.name;                                // name of the checkbox field
	var startMarker         = checkBoxFieldName.split("_checkbox")[0];  // name of the optiField's dummyInput
    var stopMarker          = startMarker +"end_of_optiField";          // name of the closing bracket

	var sourceBlock=this.sourceBlock_;
	var it = 0;
	var iplist=sourceBlock.inputList;

        //find out at which position of the inputList of sourceBlock the checkbox is present.
    while(iplist[it].name != startMarker ) {
        it++;
    }

    /*
     *  If the input field has fieldRow of length 4,
     *  then it means that it's a single level optiField with no special label
     *  (label of the attibute/element itself is used).
     *
     *  fieldRow indices:
     *      0 : The tree path made of unicode table-building characters
     *      1 : The checkbox
     *      2 : The text label for the field
     *      3 : The text/dropdown field
     */

    if(iplist[it].fieldRow.length == 4) {   // currently that's the way to detect a single-row optifield (bit risky)
        iplist[it].fieldRow[3].setVisible(newState);
    } else {
        it++;   // skipping the header
        while(iplist[it].name != stopMarker) {      // and running until the stopMarker
            if(iplist[it].fieldRow.length > 0) {    // skip the marker dummy input lines (they should always stay invisible)
                iplist[it].setVisible(newState);
                if(newState && (iplist[it].type == Blockly.NEXT_STATEMENT) ) {
                    var blockList = sourceBlock.getSlotContentsList(iplist[it].name);
                    for (var i = 0, childBlock; childBlock = blockList[i]; i++) {
                        childBlock.render();
                    }
                }
            }
            it++;
        }
    }
    sourceBlock.render();

    return newState;
}
