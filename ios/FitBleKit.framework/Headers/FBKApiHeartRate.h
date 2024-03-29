/********************************************************************************
 * 文件名称：FBKApiHeartRate.h
 * 内容摘要：心率设备API
 * 版本编号：1.0.1
 * 创建日期：2017年11月20日
 ********************************************************************************/

#import "FBKApiBsaeMethod.h"

@protocol FBKApiHeartRateDelegate <NSObject>

// 实时心率
- (void)getRealTimeHeartRate:(NSDictionary *)HRInfo andDevice:(id)bleDevice;

// 心率历史
- (void)getHeartRateRecord:(NSDictionary *)HRData andDevice:(id)bleDevice;

@end


@interface FBKApiHeartRate : FBKApiBsaeMethod

// 协议
@property(assign,nonatomic)id <FBKApiHeartRateDelegate> delegate;

// 获取历史数据
- (void)getRecordHrData;

@end
