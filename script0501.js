'use strict';

/////////////////カメラ・マイクの取得
let localStream = null;
///////////Peerオブジェクトの作成
let peer = null;
let existingCall = null;

/////////////Theta Vの解像度に合わせる
navigator.mediaDevices.getUserMedia(
	{
 audio: { echoCancellation:false },
 video: { width:{ideal: 3840,min: 1920}, height:{ideal: 1920,min: 960} ,
 frameRate:{ideal: 29.97,max: 30}, latency:{ ideal: 0.7,max: 1.7}}  //合ってるかわからないダニ
 	}
 )     
 
/*navigator.mediaDevices.getUserMedia(
	{
 audio: { echoCancellation:false },
 video: { width: 3840, height: 1920,frameRate: 28, latency:0.7}  //合ってるかわからないダニ
 	}
 )     */  
    .then(function (stream) {
        // Success
        $('#my-video').get(0).srcObject = stream;
        localStream = stream;
		localAudioStream = stream;
    }).catch(function (error) {
    // Error
    console.error('mediaDevice.getUserMedia() error:', error);
    return;
});
/////////////////////


///////////Peerオブジェクトの作成
peer = new Peer({
    key: '9373b614-604f-4fd5-b96a-919b20a7c24e',
    debug: 3
});
///////////////////////


///////////////open,error,close,disconnectedイベント
peer.on('open', function(){			//発火するお
    $('#my-id').text(peer.id);		//Peer IDの自動作成タイム
});

peer.on('error', function(err){
    alert(err.message);
});

peer.on('close', function(){
});

peer.on('disconnected', function(){
});
//////////////////////////


///////////////発信処理・切断処理・着信処理
$('#make-call').submit(function(e){
    e.preventDefault();
    const call = peer.call($('#callto-id').val(), localStream,{videoCodec: 'H264',videoBandwidth:1000}); //帯域指定する必要あるのかな
    setupCallEventHandlers(call);
});

$('#end-call').click(function(){
    existingCall.close();
});

peer.on('call', function(call){
    call.answer(localStream);
    setupCallEventHandlers(call);
});
/////////////////////


//////////Callオブジェクトに必要なイベント
function setupCallEventHandlers(call){
    if (existingCall) {
        existingCall.close();
    };

    existingCall = call;

    call.on('stream', function(stream){
        addVideo(call,stream);
        setupEndCallUI();
        $('#their-id').text(call.remoteId);
    });
    call.on('close', function(){
        removeVideo(call.remoteId);
        setupMakeCallUI();
    });
}
//////////////////////////////////


///////////video要素の再生・削除・ボタン表示
function addVideo(call,stream){
    $('#their-video').get(0).srcObject = stream;
}

function removeVideo(peerId){
    $('#'+peerId).remove();
}

function setupMakeCallUI(){
    $('#make-call').show();
    $('#end-call').hide();
}

function setupEndCallUI() {
    $('#make-call').hide();
    $('#end-call').show();
}
//////////////////////////////////////
