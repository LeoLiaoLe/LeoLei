/*@create by:  tsxiong
*@time: 2016��03��20��
*/
; (function(){
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
    //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {     
    //EventLogin();
    //@initialize scope start    
        ButtonDisable();
		var strPath = "C:\\DATA\\TransactionJournal\\";
		strPath = strPath+ top.DigitalLogDate + ".txt";
		top.Tsl.InitJnlSync(strPath, 14);
		document.getElementById("divText").innerText=top.Tsl.SearchJNLSync(1, top.SearchParam1, top.SearchParam2);
        ButtonEnable();
    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
    }
   //@User ocde scope start
    document.getElementById('Exit').onclick = function(){
        ButtonDisable()
         return CallResponse('Exit');
    }
    document.getElementById('UpLine').onclick = function(){
        document.getElementById("Tip").style.display = "none";
         document.getElementById("divText").innerText=top.Tsl.ReadJNLSync(-1,0);//ReadLines(-1,0);
    }

    document.getElementById('DownLine').onclick = function(){
        document.getElementById("Tip").style.display = "none";
         document.getElementById("divText").innerText=top.Tsl.ReadJNLSync(1,0);//ReadLines(1,0);
    }

     document.getElementById('UpPage').onclick = function () {
        document.getElementById("Tip").style.display = "none";
         document.getElementById("divText").innerText = top.Tsl.ReadJNLSync(-1, 1); //ReadLines(-1,1);
     }

     document.getElementById('DownPage').onclick = function () {
        document.getElementById("Tip").style.display = "none";
         document.getElementById("divText").innerText = top.Tsl.ReadJNLSync(1, 1); //ReadLines(1,1);
     }

     document.getElementById('ReSearch').onclick = function () {
        document.getElementById("Tip").style.display = "none";
         document.getElementById("divText").innerText = top.Tsl.SearchJNLSync(1, top.SearchParam1, top.SearchParam2);
     }

     document.getElementById('NextOne').onclick = function () {
        var tmpStr = top.Tsl.SearchJNLSync(0, top.SearchParam1, top.SearchParam2);
        if (tmpStr == "") {
            document.getElementById("Tip").style.display = "block";
        }else{
            document.getElementById("divText").innerText = tmpStr;
        }
     }


      //remove all event handler
    function Clearup(){
      top.Tsl.UnInitJnlSync();
    }
})();
