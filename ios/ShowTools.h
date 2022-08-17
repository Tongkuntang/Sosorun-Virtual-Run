/********************************************************************************
 * 文件名称：ShowTools.h
 * 内容摘要：工具类
 * 版本编号：1.0.1
 * 创建日期：2019年04月12日
 ********************************************************************************/

#import <Foundation/Foundation.h>
#import <FitBleKit/FitBleKit.h>

@interface ShowTools : NSObject

// 获取连接状态
+ (NSString *)showDeviceStatus:(DeviceBleStatus)status;

// 字节最大值溢出处理
+ (float )byteOverflow:(float)value andBitNumber:(int)bitNumber;

@end


