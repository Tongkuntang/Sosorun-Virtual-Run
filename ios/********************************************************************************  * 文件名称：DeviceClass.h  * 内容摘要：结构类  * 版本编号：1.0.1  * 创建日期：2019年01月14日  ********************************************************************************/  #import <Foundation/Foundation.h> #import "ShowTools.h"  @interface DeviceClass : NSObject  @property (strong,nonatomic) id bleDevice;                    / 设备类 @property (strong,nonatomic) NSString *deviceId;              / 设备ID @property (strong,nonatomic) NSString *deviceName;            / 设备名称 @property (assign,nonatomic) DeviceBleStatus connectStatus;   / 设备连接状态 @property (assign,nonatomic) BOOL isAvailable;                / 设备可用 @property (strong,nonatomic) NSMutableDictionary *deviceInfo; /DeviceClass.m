/********************************************************************************
 * 文件名称：DeviceClass.h
 * 内容摘要：结构类
 * 版本编号：1.0.1
 * 创建日期：2019年01月14日
 ********************************************************************************/

#import "DeviceClass.h"

@implementation DeviceClass

- (id)init
{
    self.bleDevice     = nil;
    self.deviceId      = [[NSString alloc] init];
    self.deviceName    = [[NSString alloc] init];
    self.connectStatus = DeviceBleClosed;
    self.isAvailable   = NO;
    self.deviceInfo    = [[NSMutableDictionary alloc] init];
    
    return self;
}

@end
