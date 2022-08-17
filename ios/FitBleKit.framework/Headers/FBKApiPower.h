/********************************************************************************
 * 文件名称：FBKApiPower.h
 * 内容摘要：Power API
 * 版本编号：1.0.1
 * 创建日期：2021年01月05日
 ********************************************************************************/

#import "FBKApiBsaeMethod.h"

@protocol FBKApiPowerDelegate <NSObject>
- (void)realTimePower:(int)power andDevice:(id)bleDevice;
- (void)calibrationPowerResult:(BOOL)isSucceed andValue:(int)value andDevice:(id)bleDevice;
@end


@interface FBKApiPower : FBKApiBsaeMethod

@property(assign,nonatomic)id <FBKApiPowerDelegate> delegate;

- (void)calibrationPower;

@end
