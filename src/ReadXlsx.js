import React, {Component} from 'react';
import XLSX from 'xlsx';

// keys are formatted as month,date
// month starts from 0
// date starts from 1
// var holidays = {
//     "1,21": "International mother language day",
//     "2,17":"Sheikh Mjibur Rahman's birthday",
//     "2,26":"Independence day",
//     "3,14": "Bangali NewYear",
//     "3,29": "Buddha Purnima",
//     "4,1": "May day",
//     "7,15": "National Mourning Day",
//     "11,16": "Victory Day",
//     "11,25": "Chrismas Day"
// };
//
var slaDay = 1;
var holi;
var holidays
fetch('holidays/holidays.txt')
    .then(response => response.text())
    .then(text =>
        holi = text
    ).then(holi => {
    holidays = JSON.parse(holi);
    console.log(holidays)
})


class ReadXlsx extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], /* Array of Arrays e.g. [["a","b"],[1,2]] */
            cols: []  /* Array of column objects e.g. { name: "C", K: 2 } */
        };
        this.handleFile = this.handleFile.bind(this);
        this.exportFile = this.exportFile.bind(this);
    };

    handleFile(file/*:File*/) {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, {type: rABS ? 'binary' : 'array'});
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            console.log(ws)
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, {header: 1});
            console.log(data);


            //mapping data array
            var InstanceDate = [];
            var ProcessData = []
            var myData = data.map((data, i) => {
                // console.log(data,i);
                data.map((data, i) => {
                    if (i === 1) {
                        // if(data===" "){
                        //     InstanceDate.push(0)
                        // }else
                        InstanceDate.push(data);
                    }
                    if (i === 2) {
                        // if(data===" "){
                        //     ProcessData.push(0);
                        // }else
                        ProcessData.push(data);
                    }

                })
            })
            console.log(InstanceDate);
            console.log(ProcessData);


            //
            // //pushing the diff between Instance date and Process date
            var diffDays = [];
            var timeDiff;

            //SLA Status
            var slaStatus = [];
            var slaDate = 1;

            for (var i = 1; i < InstanceDate.length; i++) {
                if (InstanceDate[i] !== " ") {
                    var date1 = new Date(InstanceDate[i]);
                } else {
                    var date1 = new Date();
                    if (slaStatus[i] == null)
                        slaStatus[i] = "Not Instanced";
                }

                if (ProcessData[i] !== " ") {
                    var date2 = new Date(ProcessData[i]);
                } else {
                    var date2 = new Date();
                    if (slaStatus[i] == null)
                        slaStatus[i] = "Not Processed"
                }


                console.log(i + ":  Instance" + InstanceDate[i] + "\t Process time" + ProcessData[i] + "\t");

                timeDiff = Math.abs(date2.getTime() - date1.getTime());
                diffDays[i] = (timeDiff / (1000 * 3600 * 24));
            }
            console.log((diffDays))
            console.log(timeDiff)
            //putting sla status meet or not

            for (var i = 0; i < InstanceDate.length; i++) {
                if (i === 0) {
                    slaStatus[i] = "Sla Status";
                } else if (slaStatus[i] === "Not Processed" || slaStatus[i] === "Not Instanced") {

                } else if (slaDay >= diffDays[i]) {
                    slaStatus[i] = "Sla Meet"
                } else {
                    slaStatus[i] = "Sla Missed";
                    var Iday = new Date(InstanceDate[i]);
                    var Pday = new Date(ProcessData[i]);
                    var nextday;
                    var count = 0;
                    var slaCount = slaDay;
                    while (Iday < Pday) {
                        nextday = addDays(Iday, 1);
                        console.log("My instance " + InstanceDate[i]);
                        console.log("Process day" + ProcessData[i]);
                        console.log(nextday)
                        console.log("lalalla")
                        Iday = nextday;
                        console.log(Iday)
                        if (nextday < Pday) {
                            if (holiday(nextday)) {

                                slaCount++;
                                console.log("sla count " + slaCount, InstanceDate[i])

                            }
                        }

                    }

                    if (diffDays[i] <= slaCount) {
                        slaStatus[i] = "Sla Meet";
                    }


                }
            }

            //next day function
            function addDays(date, days) {
                var result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
            }


            //holiday checking function
            function holiday(date) {
                var flag = false;
                console.log("entered holiday")
                var hday = new Date(date);
                var day = hday.getDay();
                var month = hday.getMonth();
                var date = hday.getDate();
                console.log("day" + day)
                console.log("date" + date);
                console.log("month" + month);
                if (day == 5 || day == 6) {
                    console.log("Holiday.........................")
                    return true
                } else if (hday) {
                    var hdayKey = month + "," + date;
                    flag = 0;
                    console.log(hdayKey)
                    Object.keys(holidays).forEach((key) => {
                        // console.log(key);//getting the key of the holiday object
                        if (key == hdayKey) {
                            console.log("holiday.........................lalalalalla")
                            flag = true;
                        }

                    })
                    if (flag) {
                        return true;
                    } else {
                        return false
                    }


                }
                console.log(hday.getDay())
                console.log(hday.getMonth());
                return false;
            }

            // holidays ...............................


            console.log(typeof(holidays))

            console.log(slaStatus)
            // var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            // var diffDays = (timeDiff / (1000 * 3600 * 24));
            // alert(diffDays);

            console.log("Instance data:" + InstanceDate)
            console.log("Process data:" + ProcessData)

            //merge sla status

            data.map((data, i) => {
                data.push(slaStatus[i])
            })
            console.log(data)
            // data.splice(7, 0, slaStatus);
            // console.log(data)
            /* Update state */
            this.setState({data: data, cols: make_cols(ws['!ref'])});
        };
        if (rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
    };


    exportFile() {
        /* convert state to workbook */
        const ws = XLSX.utils.aoa_to_sheet(this.state.data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        /* generate XLSX file and send to client */
        XLSX.writeFile(wb, "sheetjs.xlsx")
    };

    render() {

        return (
            <DragDropFile handleFile={this.handleFile}>
                <div className="row">
                    <div className="col-xs-12">
                        <DataInput handleFile={this.handleFile}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <button disabled={!this.state.data.length} className="btn btn-success"
                                onClick={this.exportFile}>Export
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <OutTable data={this.state.data} cols={this.state.cols}/>
                    </div>
                </div>
            </DragDropFile>
        );
    };
}
;


/* -------------------------------------------------------------------------- */

export  default ReadXlsx


/* list of supported file types */
const SheetJSFT = [
    "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function (x) {
    return "." + x;
}).join(",");

/* generate an array of column objects */
const make_cols = refstr => {
    let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i) o[i] = {name: XLSX.utils.encode_col(i), key: i}
    return o;
};
/* -------------------------------------------------------------------------- */


class DataInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSlaSubmit = this.handleSlaSubmit.bind(this);
    };

    handleChange(e) {
        const files = e.target.files;
        if (files && files[0]) this.props.handleFile(files[0]);
    };

    handleSlaSubmit(e) {
        e.preventDefault();
        const slad = e.target.slaDay.value;
        if(slad <= 0){
            alert("Invalid sla day ? please input positive integer");

        }else {
            slaDay=slad;
            console.log(slaDay)
        }

    }

    render() {
        return (
            <div>
                <form className="form-inline">
                    <div className="form-group">
                        <label htmlFor="file">Spreadsheet</label>
                        <input type="file" className="form-control" id="file" accept={SheetJSFT}
                               onChange={this.handleChange}/>
                    </div>
                </form>
                <form className="" onSubmit={this.handleSlaSubmit}>
                    <label>Sla Day: </label>
                    <input name="slaDay" type="number" />
                    <button className="btn-success"type="submit">submit</button>
                </form>
            </div>

        );
    };
}

/*
 Simple HTML Table
 usage: <OutTable data={data} cols={cols} />
 data:Array<Array<any> >;
 cols:Array<{name:string, key:number|string}>;
 */
class OutTable extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                    <tr>{this.props.cols.map((c) => <th key={c.key}>{c.name}</th>)}</tr>
                    </thead>
                    <tbody>
                    {this.props.data.map((r, i) => <tr key={i}>
                        {this.props.cols.map(c => <td key={c.key}>{ r[c.key] }</td>)}
                    </tr>)}
                    </tbody>
                </table>
            </div>
        );
    };
}
;

/*
 Simple HTML5 file drag-and-drop wrapper
 usage: <DragDropFile handleFile={handleFile}>...</DragDropFile>
 handleFile(file:File):void;
 */
class DragDropFile extends React.Component {
    constructor(props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
    };

    suppress(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    };

    onDrop(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        const files = evt.dataTransfer.files;
        if (files && files[0]) this.props.handleFile(files[0]);
    };

    render() {
        return (
            <div onDrop={this.onDrop} onDragEnter={this.suppress} onDragOver={this.suppress}>
                {this.props.children}
            </div>
        );
    };
}
;

