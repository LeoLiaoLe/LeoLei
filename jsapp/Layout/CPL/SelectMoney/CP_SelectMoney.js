/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var LargeOrNot = true;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        EventLogin();
		var nRet1 = top.Dat.GetPersistentData(top.API.CWDQuotaTag, top.API.CWDQuotaType);
		top.API.displayMessage("取款限额：GetPersistentData CWDQUOTA Return:" + nRet1);
        // App.Plugin.Voices.play("voi_12");
    } (); //Page Entry

    //@User ocde scope start

    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;
        document.getElementById('MoneyBtn1').disabled = true;//小额
        document.getElementById('MoneyBtn3').disabled = true;//大额
        document.getElementById('MoneyBtn4').disabled = true;//零钞
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Exit').disabled = false;
        document.getElementById('MoneyBtn1').disabled = false;//小额
        document.getElementById('MoneyBtn3').disabled = false;//大额
        document.getElementById('MoneyBtn4').disabled = false;//零钞
    }

    document.getElementById("MoneyBtn4").onclick = function () {
        top.API.displayMessage("点击零钞按钮");
        ButtonDisable();
        top.API.gMixSelfCWD = true;
        return CallResponse("EXCWD");
    }

    document.getElementById('MoneyBtn3').onclick = function () {
        top.API.displayMessage("点击大额按钮");
        ButtonDisable();
        top.API.gbAmountType = false;
        return CallResponse('OK');
    }

    document.getElementById('MoneyBtn1').onclick = function () {
        top.API.displayMessage("点击小额按钮");
        ButtonDisable();
        top.API.gbAmountType = true;
        return CallResponse('OK');
    }
   
    document.getElementById('Exit').onclick = function () {
        top.API.displayMessage("点击Exit按钮");
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    }

    //@User code scope end 
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrGet = DataValue.toArray();
        var showinfo = arrGet[0];
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + showinfo);
        top.gAmountQuota = parseInt(showinfo);
        top.Cdm.Mix(50000, "CNY", "1");
    }
    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        top.gAmountQuota = 0;
        onNotDispensable();
    }

    function onNotDispensable() {
        top.API.displayMessage("onNotDispensable触发");
        ButtonEnable();
    }

    function onCdmDeviceError() {
        top.API.displayMessage("onCdmDeviceError触发");
        ButtonEnable();
    }

    function onMixComplete(MixResult) {
        top.API.displayMessage("onMixComplete触发");
        if (top.Fpi.bDeviceStatus && top.Idr.bDeviceStatus) {
            document.getElementById('MoneyBtn3').style.display = "block";
        }       
        ButtonEnable();
    }

    function onCashUnitError(info) {
        top.API.displayMessage("onCashUnitError触发");
        ButtonEnable();
    }

    //Register the event
    function EventLogin() {
        top.Cdm.MixComplete.connect(onMixComplete);
        top.Cdm.NotDispensable.connect(onNotDispensable);
        top.Cdm.CashUnitError.connect(onCashUnitError);
        top.Cdm.DeviceError.connect(onCdmDeviceError);
        top.Dat.GetPersistentDataComplete.connect(onDatGetPersistentDataComplete);
        top.Dat.GetPersistentDataError.connect(onDatGetPersistentDataError);
    }

    function EventLogout() {
        top.Cdm.MixComplete.disconnect(onMixComplete);
        top.Cdm.NotDispensable.disconnect(onNotDispensable);
        top.Cdm.CashUnitError.disconnect(onCashUnitError);
        top.Cdm.DeviceError.disconnect(onCdmDeviceError);
        top.Dat.GetPersistentDataComplete.disconnect(onDatGetPersistentDataComplete);
        top.Dat.GetPersistentDataError.disconnect(onDatGetPersistentDataError);
    }

    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        top.API.displayMessage("直接响应<TimeOut>");
        return CallResponse('TimeOut');
        
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();
