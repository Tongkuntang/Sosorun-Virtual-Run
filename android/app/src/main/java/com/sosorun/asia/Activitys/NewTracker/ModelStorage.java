package com.sosorun.asia.Activitys.NewTracker;

import java.util.HashMap;
import java.util.Map;

public class ModelStorage {

    private Map<String, Object> newMap = new HashMap<>();

    public static ModelStorage getInstance(){
        return SingletonHolder.instance;
    }

    private static class SingletonHolder{
        private static final ModelStorage instance = new ModelStorage();
    }

    public void putModel(Map<String, Object> model){
        newMap.clear();
        newMap = model;
    }

    public Map<String, Object> getModel(){
        return newMap;
    }

    public void clearModel(){
        newMap.clear();
    }

}
