/********************************************************************************
 * 文件名称：FBKManagerCmd.h
 * 内容摘要：设备公共命令
 * 版本编号：1.0.1
 * 创建日期：2020年12月28日
 *******************************************************************************/

#import <Foundation/Foundation.h>

@interface FBKManagerCmd : NSObject

- (NSData *)deviceVersionInfoCmd;

- (NSData *)deviceMacAddressCmd;

- (NSData *)enterOTACmd;

@end
