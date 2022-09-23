package com.sosorun.asia; // replace com.your-app-name with your app’s name

import android.content.Intent;
import android.util.Log;
import android.widget.BaseAdapter;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.onecoder.fitblekit.API.Base.FBKApiBsaeMethod;
import com.onecoder.fitblekit.API.ScanDevices.FBKApiScan;
import com.onecoder.fitblekit.API.ScanDevices.FBKApiScanCallBack;
import com.onecoder.fitblekit.Ble.FBKBleDevice.FBKBleDevice;
import com.onecoder.fitblekit.API.OldTracker.FBKApiOldTrackerCallBack;
//OldTrackerActivity
import com.onecoder.fitblekit.Ble.FBKBleDevice.FBKBleDeviceStatus;
import com.onecoder.fitblekit.Protocol.Common.Parameter.FBKParaSleep;
import com.onecoder.fitblekit.Protocol.Common.Parameter.FBKParaUserInfo;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.WritableMap;
import com.onecoder.fitblekit.API.OldTracker.FBKApiOldTracker;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Fitblekit extends ReactContextBaseJavaModule {
    private ReactApplicationContext applicationContext;

    Fitblekit(ReactApplicationContext context) {
        super(context);
        this.applicationContext = context;
    }

    private static final String TAG = "MyActivity";
    private static List<FBKBleDevice> m_deviceArray = new ArrayList<>();
    private FBKApiScan m_scanner;
    private FBKApiOldTracker m_apiOldTracker;

    @Override
    public String getName() {
        return "Fitblekit";
    }

    private void sendEvent(ReactContext reactContext,
            String eventName,
            String params) {
        reactContext
                .getJSModule(RCTNativeAppEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void onScanStart(Callback callBack) {
        m_scanner = new FBKApiScan();
        FBKApiScanCallBack m_apiScanCallBack = new FBKApiScanCallBack() {
            @Override
            public void bleScanResult(List<FBKBleDevice> deviceArray, FBKApiScan apiScan) {
                m_deviceArray = deviceArray;
                deviceArray.size();

                int x = deviceArray.size();
                int y = 0;
                String rendx = "[";

                while (x > y) {
                    if (y == x - 1) {
                        rendx = rendx + deviceArray.get(y).getDeviceName() + "]";
                    } else {
                        rendx = rendx + deviceArray.get(y).getDeviceName();
                    }
                    y++;
                }
                sendEvent(applicationContext, "EVENTFBK", rendx);
                // m_scanner.stopScan();
            }

            @Override
            public void bleScanAvailable(Boolean isAvailable, FBKApiScan apiScan) {

            }
        };

        m_scanner.setScanRssi(-120);
        m_scanner.setScanName("MOVE");
        m_scanner.startScan(m_apiScanCallBack);

        callBack.invoke("SUCCESS");
    }

    private FBKApiOldTrackerCallBack m_apiOldTrackerCallBack = new FBKApiOldTrackerCallBack() {

        @Override
        public void bleConnectError(String s, FBKApiBsaeMethod fbkApiBsaeMethod) {
            sendEvent(applicationContext, "ERRORBLE", s);
        }

        @Override
        public void bleConnectStatus(FBKBleDeviceStatus fbkBleDeviceStatus, FBKApiBsaeMethod fbkApiBsaeMethod) {
            sendEvent(applicationContext, "ERRORBLE", fbkBleDeviceStatus.toString());
        }

        @Override
        public void batteryPower(int i, FBKApiBsaeMethod fbkApiBsaeMethod) {
            sendEvent(applicationContext, "batteryPower", String.valueOf(i));
        }

        @Override
        public void protocolVersion(String s, FBKApiBsaeMethod fbkApiBsaeMethod) {

        }

        @Override
        public void firmwareVersion(String s, FBKApiBsaeMethod fbkApiBsaeMethod) {

        }

        @Override
        public void hardwareVersion(String s, FBKApiBsaeMethod fbkApiBsaeMethod) {

        }

        @Override
        public void softwareVersion(String s, FBKApiBsaeMethod fbkApiBsaeMethod) {

        }

        @Override
        public void privateVersion(Map<String, String> map, FBKApiBsaeMethod fbkApiBsaeMethod) {

        }

        @Override
        public void privateMacAddress(Map<String, String> map, FBKApiBsaeMethod fbkApiBsaeMethod) {

        }

        @Override
        public void realTimeHeartRate(Object o, FBKApiOldTracker fbkApiOldTracker) {

        }

        @Override
        public void realTimeSteps(Object data, FBKApiOldTracker apiOldTracker) {
            final Map<String, String> resultMap = (Map<String, String>) data;
            sendEvent(applicationContext, "EVENTFBKSTEP", resultMap.get("steps"));
        }

        @Override
        public void findPhone(boolean b, FBKApiOldTracker fbkApiOldTracker) {

        }

        @Override
        public void oldTrackerRecord(Object data, FBKApiOldTracker apiOldTracker) {
            sendEvent(applicationContext, "EVENTFBKSTEP1", data.toString());
        }

    };

    @ReactMethod
    public void onScanStop() {
        m_apiOldTracker = new FBKApiOldTracker(applicationContext, m_apiOldTrackerCallBack);
        // m_apiOldTracker.unregisterBleListenerReceiver();
        m_apiOldTracker.disconnectBle();

    }

    @ReactMethod
    public void onConnect(int name, String location, Callback callBack) {
        m_apiOldTracker = new FBKApiOldTracker(applicationContext, m_apiOldTrackerCallBack);
        FBKBleDevice myBleDevice = m_deviceArray.get(name);
        sendEvent(applicationContext, "EVENTFBKSTEP1", myBleDevice.getDeviceName());
        m_apiOldTracker.connecBluetooth(myBleDevice.getMacAddress());
        m_apiOldTracker.registerBleListenerReceiver();
        FBKParaUserInfo myUserInfo = new FBKParaUserInfo();
        myUserInfo.setGender(1);
        myUserInfo.setAge(25);
        myUserInfo.setHeight(172);
        myUserInfo.setWeight(70);
        myUserInfo.setStepSize(70);
        myUserInfo.setStepGoal(50000);
        m_apiOldTracker.setUserInfo(myUserInfo);
        FBKParaSleep mySleepInfo = new FBKParaSleep();
        mySleepInfo.setNormalStartHour(22);
        mySleepInfo.setNormalStartMinute(0);
        mySleepInfo.setNormalEndHour(8);
        mySleepInfo.setNormalEndMinute(0);
        mySleepInfo.setWeekendStartHour(23);
        mySleepInfo.setWeekendStartMinute(0);
        mySleepInfo.setWeekendEndHour(9);
        mySleepInfo.setWeekendEndMinute(0);
        m_apiOldTracker.setSleepInfo(mySleepInfo);
    }

}