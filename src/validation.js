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
 */

/* ***************************************************************************

    This file contains methods that ensure that the blocks in the Blockly workspace are attached to each other in a valid sequence.
 */


function validateBlocklyGraph(){
    var blocks = Blockly.getMainWorkspace().getTopBlocks();

    if(blocks.length == 0){
        alert("Workspace is empty");
        return false;
    } else if(blocks.length > 1){
		alert("Only the start block is allowed to be placed directly in the workspace");
        return false;
	} else if(blocks[0].type != "block_0"){
        alert("It is compulsory to use the start block (block_0:start)");
        return false;
    } else {
        var blocklyValidationResult = validateBlock(blocks[0]);

        if(blocklyValidationResult) {
            generateXML();
            alert("You may save this");
        } else {
            alert("error");
        }
        return blocklyValidationResult;
    }
}

//get all blocks. Send each block's slots for validation. Send each child block of each slot for validation
function validateBlock(block){
	var blockValidationResult   = true;
    var availableNotchNumbers   = block.getStatementInputNames();

    for(var i=0; i<availableNotchNumbers.length; i++) {
        var notchNumber         = availableNotchNumbers[i];
        var slotContents        = block.getSlotContentsList(notchNumber);
        var errorContext        = block.type+", slot #"+(i+1);  // not a unique context, but will do for now; the slot# makes sense as a local base-1 number

        var actualChildren = getBlockTypesOfSlotContents(slotContents);
        var thisNotchIsValid = validatorDict[block.type][notchNumber].validate(actualChildren)
        console.log("notch", block.type, notchNumber, actualChildren, validatorDict[block.type][notchNumber], thisNotchIsValid );

        blockValidationResult = thisNotchIsValid && blockValidationResult;
        for(var j=0;j<slotContents.length;j++){
            blockValidationResult = validateBlock(slotContents[j]) && blockValidationResult; // check each of the child blocks in turn
        }
    }
	return blockValidationResult;
}

function getBlockTypesOfSlotContents(blockArray){
	var ans = [];
	for(var i=0; i<blockArray.length; i++){
		ans.push( blockArray[i].type );
	}
	return ans;
}