/********************************************************************************
 * 文件名称：DeviceClass.h
 * 内容摘要：结构类
 * 版本编号：1.0.1
 * 创建日期：2019年01月14日
 ********************************************************************************/

#import <Foundation/Foundation.h>
#import "ShowTools.h"

@interface DeviceClass : NSObject

@property (strong,nonatomic) id bleDevice;                    // 设备类
@property (strong,nonatomic) NSString *deviceId;              // 设备ID
@property (strong,nonatomic) NSString *deviceName;            // 设备名称
@property (assign,nonatomic) DeviceBleStatus connectStatus;   // 设备连接状态
@property (assign,nonatomic) BOOL isAvailable;                // 设备可用
@property (strong,nonatomic) NSMutableDictionary *deviceInfo; // 设备信息

@end

