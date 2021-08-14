const PS = new PerfectScrollbar('.input-cell-container', {
    wheelSpeed: 6,
    wheelPropagation: true
});

function findRowCol(ele) {
    let idArray = $(ele).attr("id").split("-");
    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);

    return [rowId, colId];
}

for (let i = 1; i <= 100; i++) {
    let ans = "";

    let n = i;

    while (n > 0) {
        let rem = n % 26;

        if (rem == 0) {
            ans = "Z" + ans;

            n = Math.floor(n / 26) - 1;
        } else {
            ans = String.fromCharCode(rem - 1 + 65) + ans;
            n = Math.floor(n / 26);
        }
    }

    let column = $(`<div class="column-name colCod-${ans} colId-${i}">${ans}</div>`);
    $(".column-name-container").append(column);
    let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
    $(".row-name-container").append(row);
}

let cellData = { "Sheet1" : []};
let totalSheets = 1;
let selectedSheet = "Sheet1";
let mousemoved = false;
let startCellStored = false;
let startCell;
let endCell;

function loadNewSheet(){
    $(".input-cell-container").text("");
    for (let i = 1; i <= 100; i++) {
        let row = $(`<div class="cell-row"></div>`);
        let rowArray = [];
        for (let j = 1; j <= 100; j++) {
            let colCode = $(`.colId-${j}`).attr("class").split("-")[2];
            let column = $(`<div class="input-cell code-${colCode}" id="row-${i}-col-${j}" contenteditable = "false" ></div>`);
            row.append(column);
            rowArray.push({
                "font-family": "sans-serif",
                "font-size": 14,
                "text": "",
                "bold": false,
                "italic": false,
                "underlined": false,
                "alignment": "left",
                "color": "",
                "bgcolor": "",
            })
        }
        cellData[selectedSheet].push(rowArray);
        $(".input-cell-container").append(row);
    }
    addEventsToCells();
}

loadNewSheet();

function addEventsToCells(){
    $(".input-cell").dblclick(function () {
        $(this).attr("contenteditable", "true");
        $(this).focus();
    })
    
    $(".input-cell").blur(function () {
        $(this).attr("contenteditable", "false");
        let [rowId,colId] = findRowCol(this);
        cellData[selectedSheet][rowId - 1][colId -1].text() = $(this).text();
    })

    $(".input-cell").click(function (e) {

        let [rowId, colId] = findRowCol(this);
        let [topCell, bottomCell, rightCell, leftCell] = getTopBottomRightLeftCells(rowId, colId);
    
        if ($(this).hasClass("selected") && e.ctrlKey) {
            unselectCell(this, e, topCell, bottomCell, rightCell, leftCell);
        } else {
            selectCell(this, e, topCell, bottomCell, rightCell, leftCell);
        }
    
    });

    $(".input-cell").mousemove(function (event) {
        event.preventDefault();
        if (event.buttons == 1 && !event.ctrlKey) {
            mousemoved = true;
            $(".input-cell.selected").removeClass("selected bottom-selected top-selected right-selected left-selected");
            if (!startCellStored) {
                let [rowId, colId] = findRowCol(event.target);
                startCell = { rowId: rowId, colId: colId };
                startCellStored = true;
            } else {
                let [rowId, colId] = findRowCol(event.target);
                endCell = { rowId: rowId, colId: colId };
                selectAllBetweenTheRange(startCell, endCell);
            }
        } else if (event.buttons == 0 && mousemoved) {
            mousemoved = false;
            startCellStored = false;
        }
    })
    
}

$(".align-icon").click(function () {
    $(".align-icon.selected").removeClass("selected");
    $(this).addClass("selected");
})

/* $(".style-icon").click(function () {
    $(this).toggleClass("selected");
}) */

$(".input-cell-container").scroll(function () {
    $(".column-name-container").scrollLeft(this.scrollLeft);
    $(".row-name-container").scrollTop(this.scrollTop);
})



function getTopBottomRightLeftCells(rowId, colId) {
    let topCell = $(`#row-${rowId - 1}-col-${colId}`);
    let bottomCell = $(`#row-${rowId + 1}-col-${colId}`);
    let rightCell = $(`#row-${rowId}-col-${colId + 1}`);
    let leftCell = $(`#row-${rowId}-col-${colId - 1}`);
    return [topCell, bottomCell, rightCell, leftCell];
}


function unselectCell(ele, e, topCell, bottomCell, rightCell, leftCell) {
    if ($(ele).attr("contenteditable") == "false") {
        if ($(ele).hasClass("top-selected")) {
            topCell.removeClass("bottom-selected");
        }
        if ($(ele).hasClass("bottom-selected")) {
            bottomCell.removeClass("top-selected");
        }
        if ($(ele).hasClass("left-selected")) {
            leftCell.removeClass("right-selected");
        }
        if ($(ele).hasClass("right-selected")) {
            rightCell.removeClass("left-selected");
        }
        $(ele).removeClass("selected bottom-selected top-selected right-selected left-selected");
    }
}

function selectCell(ele, e, topCell, bottomCell, rightCell, leftCell, mouseSelection) {
    if (e.ctrlKey || mouseSelection) {

        //top selected or not
        let topSelected;
        if (topCell) {

            topSelected = topCell.hasClass("selected");
        }


        //bottom selected or not
        let bottomSelected;
        if (bottomCell) {
            bottomSelected = bottomCell.hasClass("selected");
        }

        //right selected or not
        let rightSelected;
        if (rightCell) {
            rightSelected = rightCell.hasClass("selected");
        }

        //left selected or not
        let leftSelected;

        if (leftCell) {
            leftSelected = leftCell.hasClass("selected");
        }

        if (topSelected) {
            topCell.addClass("bottom-selected");
            $(ele).addClass("top-selected");
        }

        if (leftSelected) {
            leftCell.addClass("right-selected");
            $(ele).addClass("left-selected");
        }
        if (rightSelected) {
            rightCell.addClass("left-selected");
            $(ele).addClass("right-selected");
        }
        if (bottomSelected) {
            bottomCell.addClass("top-selected");
            $(ele).addClass("bottom-selected");
        }
    } else {
        $(".input-cell.selected").removeClass("selected bottom-selected top-selected right-selected left-selected");
    }

    $(ele).addClass("selected");
    changeHeader(findRowCol(ele));
}

function changeHeader([rowId, colId]) {
    let data = cellData[rowId - 1, colId - 1];
    if (cellData.bold) {
        $(".icon-bold").addClass("selected");
    }
}

function selectAllBetweenTheRange(start, end) {

    for (let i = (start.rowId < end.rowId ? start.rowId : end.rowId); i <= (start.rowId < end.rowId ? end.rowId : start.rowId); i++) {
        for (let j = (start.colId < end.colId ? start.colId : end.colId); j <= (start.colId < end.colId ? end.colId : start.colId); j++) {
            let [topCell, bottomCell, rightCell, leftCell] = getTopBottomRightLeftCells(i, j);
            selectCell($(`#row-${i}-col-${j}`)[0], {}, topCell, bottomCell, rightCell, leftCell, true);
        }
    }
}

$(".icon-bold").click(function (e) {
    if ($(this).hasClass("selected")) {

    } else {

        $(this).addClass("selected");
        $(".input-cell.selected").css("font-weight", "bold");
        $(".input-cell.selected").each(function (index, ele) {

            let [rowId, colId] = findRowCol(data);
            cellData[rowId - 1, colId - 1].bold = true;
        });
    }

})

/* $(".icon-italic").click(function(e){
    if($(this).hasClass("selected")){
        $(this).removeClass("selected");
        $(".input-cell.selected").each(function(index,ele){
            $(ele).html(`${$(ele).text()}`);
        })
    } else {
        $(this).addClass("selected");
        $(".input-cell.selected").each(function(index,ele){
            $(ele).html(`<i>${$(ele).text()}</i>`)
        })
    }
    
}) */

$(".sheet-tab").bind("contextmenu", function (e) {

    e.preventDefault();
    selectSheet(this);
    $(".sheet-options-modal").remove();
    let modal = $(`<div class="sheet-options-modal">
                    <div class="option sheet-rename">Rename</div>
                    <div class="option sheet-delete">Delete</div>
                </div>`);
    $(".container").append(modal);
    $(".sheet-options-modal").css({ "bottom": 0.04 * $(window).height(), "left": e.pageX });
    $(".sheet-rename").click(function(){
       
    })
});

$(".container").click(function(e){
    $(".sheet-options-modal").remove();
})

$(".sheet-tab").click(function(){
    if( !$(this).hasClass("selected")){
        selectSheet(this);
    }
    
})

function selectSheet(ele){
    $(".sheet-tab.selected").removeClass("selected");
    $(ele).addClass("selected");
    selectedSheet = $(ele).text;
    loadSheet();
}

function loadSheet() {
    
}

$(".icon-add-circle").click(function(e) {
    totalSheets++;
    cellData[`Sheet${totalSheets}`] = [];
    selectedSheet = `Sheet${totalSheets}`;
    loadNewSheet();
    $(".sheet-tab.selected").removeClass("selected");
    $(".sheet-tab-container").append(`<div class="sheet-tab selected">Sheet${totalSheets}</div>`);
    
})