/********************************************************************************
 * 文件名称：FBKCadenceData.h
 * 内容摘要：踏频速度计算
 * 版本编号：1.0.1
 * 创建日期：2017年11月20日
 ********************************************************************************/

#import <Foundation/Foundation.h>

@interface FBKCadenceData : NSObject

@property(assign,nonatomic) double whellDiameter;

- (void)clearCadenceData;

- (void)clearSpeedData;

- (NSDictionary *)calculationDeviceData:(NSDictionary *)cadenceMap;

@end
