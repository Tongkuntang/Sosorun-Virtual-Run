/********************************************************************************
 * 文件名称：FBKPowerAnaly.h
 * 内容摘要：功率计蓝牙解析
 * 版本编号：1.0.1
 * 创建日期：2021年01月04日
 ********************************************************************************/

#import <Foundation/Foundation.h>

typedef enum{
    PowerResultRealTime = 0,
    PowerResultCalibration = 1,
} PowerResult;


@protocol FBKPowerAnalyDelegate <NSObject>
- (void)analyticalResult:(id)resultData withResultNumber:(PowerResult)resultId;
@end


@interface FBKPowerAnaly : NSObject

@property(assign,nonatomic)id <FBKPowerAnalyDelegate> delegate;

- (void)receiveRealTimeData:(NSString *)hexString;

- (void)receiveBlueData:(NSString *)hexString;

@end
