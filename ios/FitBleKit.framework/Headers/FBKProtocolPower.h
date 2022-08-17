/********************************************************************************
 * 文件名称：FBKProtocolPower.h
 * 内容摘要：功率计蓝牙协议
 * 版本编号：1.0.1
 * 创建日期：2021年01月04日
 ********************************************************************************/

#import "FBKProtocolBase.h"
#import "FBKPowerCmd.h"
#import "FBKPowerAnaly.h"

typedef enum{
    PowerCalibration= 0,
} PowerCmdNumber;


@interface FBKProtocolPower : FBKProtocolBase <FBKPowerAnalyDelegate>

@end
