/********************************************************************************
 * 文件名称：FBKManagerAnaly.h
 * 内容摘要：设备公共解析
 * 版本编号：1.0.1
 * 创建日期：2020年12月28日
 *******************************************************************************/

#import <Foundation/Foundation.h>

typedef enum{
    AllDeviceVersion = 0,
    AllDeviceMacAddress,
} AllDeviceResult;

@interface FBKManagerAnaly : NSObject

- (NSDictionary *)analyMacVersion:(NSData *)byteData;

@end

