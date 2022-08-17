/********************************************************************************
 * 文件名称：ShowTools.m
 * 内容摘要：工具类
 * 版本编号：1.0.1
 * 创建日期：2019年04月12日
 ********************************************************************************/

#import "ShowTools.h"

@implementation ShowTools


/********************************************************************************
 * 方法名称：showDeviceStatus
 * 功能描述：获取连接状态
 * 输入参数：
 * 返回数据：
 ********************************************************************************/
+ (NSString *)showDeviceStatus:(DeviceBleStatus)status {
    switch (status) {
        case DeviceBleClosed:
            return @"Closed";
            break;
            
        case DeviceBleIsOpen:
            return @"BleIsOpen";
            break;
            
        case DeviceBleSearching:
            return @"Searching";
            break;
            
        case DeviceBleConnecting:
            return @"Connecting";
            break;
            
        case DeviceBleConnected:
            return @"Connected";
            break;
            
        case DeviceBleSynchronization:
            return @"Synchronization";
            break;
            
        case DeviceBleSyncOver:
            return @"SyncOver";
            break;
            
        case DeviceBleSyncFailed:
            return @"SyncFailed";
            break;
            
        case DeviceBleDisconnecting:
            return @"Disconnecting";
            break;
            
            case DeviceBleDisconneced:
            return @"Disconneced";
            break;
            
        case DeviceBleReconnect:
            return @"Reconnecting";
            break;
            
        default:
            return @"nil";
            break;
    }
}


/***************************************************************************
 * 方法名称：byteOverflow
 * 功能描述：字节最大值溢出处理
 * 输入参数：
 * 返回数据：
 ***************************************************************************/
+ (float )byteOverflow:(float)value andBitNumber:(int)bitNumber {
    float hiNum = 0;
    float resultNum = value;
    
    if (bitNumber == 4) {
        int tww = 255;
        hiNum = (tww<<24)+(tww<<16)+(tww<<8)+tww;
    }
    else if (bitNumber == 2) {
        hiNum = 65535;
    }
    
    if (value < 0) {
        resultNum = value+hiNum;
    }
    
    return resultNum;
}


@end
