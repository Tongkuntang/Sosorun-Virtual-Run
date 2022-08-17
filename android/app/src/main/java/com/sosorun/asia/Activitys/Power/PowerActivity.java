package com.sosorun.asia.Activitys.Power;

import static com.sosorun.asia.Activitys.ScanDevices.DevicesScanActivity.SCAN_ACTIVITY_BACK;

import android.app.Activity;
import android.bluetooth.BluetoothDevice;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.onecoder.fitblekit.API.Base.FBKApiBsaeMethod;
import com.onecoder.fitblekit.API.Power.FBKApiPower;
import com.onecoder.fitblekit.API.Power.FBKApiPowerCallBack;
import com.onecoder.fitblekit.Ble.FBKBleDevice.FBKBleDeviceStatus;
import com.sosorun.asia.Activitys.ScanDevices.DevicesScanActivity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class PowerActivity extends Activity {

    // TAG值
    private static final String TAG = PowerActivity.class.getSimpleName();

    // 获取扫描设备TAG
    public static int POWER_TO_SCAN = 20001;

    // 蓝牙设备
    private BluetoothDevice m_bluetoothDevice;

    // 设备API
    private FBKApiPower m_apiPower;

    // ListView
    private ListView m_powerListView;

    // ListView BaseAdapter
    private BaseAdapter m_powerAdapter;

    // List
    private static List<String> m_powerArray = new ArrayList<>();

    // 连接状态
    private TextView m_statusText;

    // 速度
    private TextView m_powerText;

    // 回调
    private FBKApiPowerCallBack m_apiPowerCallBack = new FBKApiPowerCallBack() {
        @Override
        public void realTimePower(int power, FBKApiPower apiPower) {
            final int myPower = power;
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    m_powerText.setText("power: "+myPower);
                }
            });
        }

        @Override
        public void calibrationPowerResult(boolean isSucceed, int value, FBKApiPower apiPower) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(PowerActivity.this,"set result:"+isSucceed+"---"+value,Toast.LENGTH_SHORT).show();
                }
            });
        }

        @Override
        public void bleConnectError(String error, FBKApiBsaeMethod apiBsaeMethod) {
            final String errorString = error;
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(PowerActivity.this,errorString,Toast.LENGTH_SHORT).show();
                }
            });
        }

        @Override
        public void bleConnectStatus(FBKBleDeviceStatus connectStatus, FBKApiBsaeMethod apiBsaeMethod) {
            final FBKBleDeviceStatus status = connectStatus;
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (status == FBKBleDeviceStatus.BleConnecting) {
                        m_statusText.setText("Connecting");
                    }
                    else if (status == FBKBleDeviceStatus.BleConnected) {
                        m_statusText.setText("Connected");
                    }
                    else if (status == FBKBleDeviceStatus.Blesynchronizing) {
                        m_statusText.setText("Synchronizing");
                    }
                    else if (status == FBKBleDeviceStatus.BleSyncOver) {
                        m_statusText.setText("Syn Over");
                    }
                    else if (status == FBKBleDeviceStatus.BleReconnect) {
                        m_statusText.setText("Reconnecting");
                    }
                    else if (status == FBKBleDeviceStatus.BleTurnOn) {
                        m_statusText.setText("BleTurnOn");
                        if (m_bluetoothDevice != null) {
                            m_apiPower.connecBluetooth( m_bluetoothDevice);
                        }
                    }
                    else if (status == FBKBleDeviceStatus.BleTurnOff) {
                        m_statusText.setText("BleTurnOff");
                    }
                }
            });
        }

        @Override
        public void batteryPower(int power, FBKApiBsaeMethod apiBsaeMethod) {
            final int batteryPower = power;
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    m_powerArray.set(0,"Read Battery Power"+"   ("+String.valueOf(batteryPower)+"%"+")");
                    m_powerAdapter.notifyDataSetChanged();
                }
            });
        }

        @Override
        public void protocolVersion(String version, FBKApiBsaeMethod apiBsaeMethod) {

        }

        @Override
        public void firmwareVersion(String version, FBKApiBsaeMethod apiBsaeMethod) {
            final String nowVersion = version;
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    m_powerArray.set(1,"Read Firmware Version"+"   ("+nowVersion+")");
                    m_powerAdapter.notifyDataSetChanged();
                }
            });
        }

        @Override
        public void hardwareVersion(String version, FBKApiBsaeMethod apiBsaeMethod) {
            final String nowVersion = version;
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    m_powerArray.set(2,"Read Hardware Version"+"   ("+nowVersion+")");
                    m_powerAdapter.notifyDataSetChanged();
                }
            });
        }

        @Override
        public void softwareVersion(String version, FBKApiBsaeMethod apiBsaeMethod) {
            final String nowVersion = version;
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    m_powerArray.set(3,"Read Software Version"+"   ("+nowVersion+")");
                    m_powerAdapter.notifyDataSetChanged();
                }
            });
        }

        @Override
        public void privateVersion(Map<String, String> versionMap, FBKApiBsaeMethod apiBsaeMethod) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(PowerActivity.this,versionMap.toString(),Toast.LENGTH_SHORT).show();
                }
            });
        }

        @Override
        public void privateMacAddress(Map<String, String> macMap, FBKApiBsaeMethod apiBsaeMethod) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(PowerActivity.this,macMap.toString(),Toast.LENGTH_SHORT).show();
                }
            });
        }
    };


    /************************************************************************************
     * 方法名称：onCreate
     * 功能描述：初始化
     * 输入参数：
     * 返回数据：
     ************************************************************************************/
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        m_apiPower = new FBKApiPower(PowerActivity.this, m_apiPowerCallBack);
        m_apiPower.registerBleListenerReceiver();
        m_powerArray.clear();
        m_powerArray.add("Read Battery Power");
        m_powerArray.add("Read Firmware Version");
        m_powerArray.add("Read Hardware Version");
        m_powerArray.add("Read Software Version");
        m_powerArray.add("Private get version");
        m_powerArray.add("Private get mac");
        m_powerArray.add("Private Enter OTA Mode");
    }


    /************************************************************************************
     * 方法名称：onDestroy
     * 功能描述：销毁页面
     * 输入参数：
     * 返回数据：
     ************************************************************************************/
    @Override
    protected void onDestroy() {
        super.onDestroy();
        m_apiPower.disconnectBle();
        m_apiPower.unregisterBleListenerReceiver();
    }


    /************************************************************************************
     * 方法名称：initView
     * 功能描述：获取成员变量
     * 输入参数：
     * 返回数据：
     ************************************************************************************/


    /************************************************************************************
     * 方法名称：backAction
     * 功能描述：返回
     * 输入参数：
     * 返回数据：
     ************************************************************************************/
    public void backAction(View view) {
        finish();
    }


    /************************************************************************************
     * 方法名称：deviceAction
     * 功能描述：选择设备
     * 输入参数：
     * 返回数据：
     ************************************************************************************/
    public void deviceAction(View view) {
        Intent intent = new Intent(PowerActivity.this, DevicesScanActivity.class);
        startActivityForResult(intent,POWER_TO_SCAN);
    }


    /************************************************************************************
     * 方法名称：onActivityResult
     * 功能描述：
     * 输入参数：
     * 返回数据：
     ************************************************************************************/
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == POWER_TO_SCAN && resultCode == SCAN_ACTIVITY_BACK) {
            Log.e(TAG,"onActivityResult");
            m_bluetoothDevice = data.getParcelableExtra("bluetooth");
            m_apiPower.connecBluetooth(m_bluetoothDevice);
        }
    }

}
