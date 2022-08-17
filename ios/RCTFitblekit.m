#import "RCTFit.h"
#import "DeviceClass.h"
#import <UIKit/UIKit.h>

@interface Fitblekit ()<RCTBridgeModule,FBKApiScanDevicesDelegate> {
    FBKApiScanDevices *m_scanBlue;
    UITableView       *m_searchEquTableView;
    NSMutableArray<FBKApiScanDevicesDelegate>   *m_searchEquArray;
    NSMutableArray<FBKApiScanDevicesDelegate>   *m_chooseArray;
    NSUInteger *index;
    RCTResponseSenderBlock calls;
    int            m_chooseNumber;
    UILabel        *m_alertLab;
}

@end

@implementation Fitblekit

//export the name of the native module as 'Device' since no explicit name is mentioned
RCT_EXPORT_MODULE(Fitblekit);

- (NSArray<NSString *> *)supportedEvents {
  return @[@"CONNECT",@"COMPLETE"];
}

//exports a method getDeviceName to javascript
RCT_EXPORT_METHOD(getDeviceName:(RCTResponseSenderBlock)callback){
 @try{
   NSString *deviceName = [[UIDevice currentDevice] name];
   callback(@[[NSNull null], deviceName]);
 }
 @catch(NSException *exception){
   callback(@[exception.reason, [NSNull null]]);
 }
}



RCT_EXPORT_METHOD(onScanStart:(RCTResponseSenderBlock)callback){
 @try{
//   UITableView       *m_searchEquTableView;
   NSMutableArray<FBKApiScanDevicesDelegate> *m_searchEquArray;
   NSMutableArray<FBKApiScanDevicesDelegate> *m_chooseArray;
//   FBKApiOldBand  *m_oldBandApi;
   m_chooseArray = [[NSMutableArray<FBKApiScanDevicesDelegate> alloc] init];
   m_searchEquArray = [[NSMutableArray<FBKApiScanDevicesDelegate> alloc] init];
   m_scanBlue = [[FBKApiScanDevices alloc] init];
   m_scanBlue.delegate = self;
   
   
//   m_oldBandApi = [[FBKApiOldBand alloc] init];
//   m_oldBandApi.delegate = self;
//   m_oldBandApi.dataSource = self;

//   NSString *deviceId= @"18B8A18E-DDC7-4F46-AB06-F731EA803B42";
//   [m_oldBandApi startConnectBleApi:deviceId andIdType:DeviceIdUUID];
   [m_scanBlue stopScanBleApi];
   callback(@[[NSNull null], m_searchEquArray]);
  
 }
 @catch(NSException *exception){
   callback(@[exception.reason, [NSNull null]]);
 }
}

RCT_EXPORT_METHOD(onConnect:(NSUInteger *)name myCallback:(RCTResponseSenderBlock)callback){
 @try{
   
   FBKApiOldBand *oldBandApi = [[FBKApiOldBand alloc] init];
   oldBandApi.delegate = self;
   oldBandApi.dataSource = self;
   
   // 设置个人基本信息
   index = name;
   FBKDeviceUserInfo *myUserInfo = [[FBKDeviceUserInfo alloc] init];
   myUserInfo.weight = @"60";     // 体重范围为0-600（千克）
   myUserInfo.height = @"170";    // 身高范围为0-255（厘米）
   myUserInfo.age   = @"30";      // 年龄范围为0-255
   myUserInfo.gender = @"1";      // 0代表女  1代表男
   myUserInfo.walkGoal = @"6000"; // 目标步数小于10000000（步）
   [oldBandApi setUserInfoApi:myUserInfo];
   
   // 设置个人睡眠信息
   FBKDeviceSleepInfo *mySleepInfo = [[FBKDeviceSleepInfo alloc] init];
   mySleepInfo.normalStart = @"22:00";  // 时间为24小时制 格式必须为“HH:mm”
   mySleepInfo.normalEnd   = @"08:00";  // 时间为24小时制 格式必须为“HH:mm”
   mySleepInfo.weekdayStart= @"23:49";  // 时间为24小时制 格式必须为“HH:mm”
   mySleepInfo.weekdaylEnd = @"09:00";  // 时间为24小时制 格式必须为“HH:mm”
   [oldBandApi setSleepInfoApi:mySleepInfo];
   
   // 设置单车参数
   [oldBandApi setBikeInfoApi:@"2.096"];
   
   // 设置限制参数
   FBKDeviceLimit *myLimitInfo = [[FBKDeviceLimit alloc] init];
   myLimitInfo.limitSteps = @"15";   // 每分钟的步数限制
   myLimitInfo.limitMinutes = @"60"; // 限制的总分钟数
   myLimitInfo.timeInterval= @"20";  // 活跃时间的时间间隔
   myLimitInfo.stepStandard = @"35"; // 活跃时间的步数判定标准
   [oldBandApi setLimitInfoApi:myLimitInfo];
   
   DeviceClass *myBleDevice = [[DeviceClass alloc] init];
   myBleDevice.bleDevice = oldBandApi;
   myBleDevice.deviceId = @"";
   myBleDevice.isAvailable = NO;
   myBleDevice.connectStatus = DeviceBleClosed;
   
//   DeviceClass *myBleDevice = [m_searchEquArray objectAtIndex:1];
//
//   NSLog(@"myBleDevice.deviceId %@",myBleDevice.deviceId);
   [m_scanBlue stopScanBleApi];
//   myBleDevice.deviceId = [[deviceIdArray objectAtIndex:1] objectForKey:@"deviceId"];
//   myBleDevice.deviceName = [[deviceIdArray objectAtIndex:1] objectForKey:@"deviceName"];
//   if (myBleDevice.isAvailable) {
//       FBKApiOldBand *oldBandApi = myBleDevice.bleDevice;
//       [oldBandApi startConnectBleApi:myBleDevice.deviceId andIdType:DeviceIdUUID];
//       NSLog(@"myBleDevice.deviceId %@",myBleDevice.deviceId);
//   }
   
 }
 @catch(NSException *exception){
   callback(@[exception.reason, [NSNull null]]);
 }
}

- (void)bleConnectStatus:(DeviceBleStatus)status andDevice:(id)bleDevice {
    FBKApiOldBand *oldBandApi = (FBKApiOldBand *)bleDevice;
    for (int i = 0; i < m_searchEquArray.count; i++) {
        DeviceClass *myBleDevice = [m_searchEquArray objectAtIndex:i];
        FBKApiOldBand *listApi = myBleDevice.bleDevice;
        if (oldBandApi == listApi) {
            myBleDevice.connectStatus = status;
            if (status == DeviceBleClosed) {
                myBleDevice.isAvailable = NO;
            }
            else if (status == DeviceBleIsOpen) {
                myBleDevice.isAvailable = YES;
                if (myBleDevice.deviceId.length > 0) {
                    [listApi startConnectBleApi:myBleDevice.deviceId andIdType:DeviceIdUUID];
                }
            }
            break;
        }
    }
    
    DeviceClass *myBleDevice = [m_searchEquArray objectAtIndex:m_chooseNumber];
    FBKApiOldBand *chooseApi = (FBKApiOldBand *)myBleDevice.bleDevice;
    if (chooseApi == oldBandApi) {
        m_alertLab.text = [ShowTools showDeviceStatus:status];
    }
}

- (void)getDeviceList:(NSArray *)deviceList {
    [m_searchEquArray removeAllObjects];
    [m_searchEquArray addObjectsFromArray:deviceList];
    [self sendEventWithName:@"CONNECT" body:@{@"name": deviceList}];
}

- (void)getDeviceId:(NSArray *)deviceIdArray {
        NSLog(@"myBleDevice.deviceId %lu",*(index));
  
        DeviceClass *myBleDevice = [m_searchEquArray objectAtIndex:*(index)];
        myBleDevice.deviceId = [[deviceIdArray objectAtIndex:*(index)] objectForKey:@"deviceId"];
        NSLog(@"myBleDevice.deviceId %@", myBleDevice.deviceId);
        myBleDevice.deviceName = [[deviceIdArray objectAtIndex:*(index)] objectForKey:@"deviceName"];
        if (myBleDevice.isAvailable) {
            FBKApiOldBand *oldBandApi = myBleDevice.bleDevice;
            [oldBandApi startConnectBleApi:myBleDevice.deviceId andIdType:DeviceIdUUID];
            NSLog(@"myBleDevice.deviceId %@",myBleDevice.deviceId);
        }
  
}

- (void)phoneBleStatus:(BOOL)isPoweredOn {
  if (isPoweredOn) {
      [m_scanBlue startScanBleApi:nil isRealTimeDevice:NO withRssi:70];
  }
}

@end

