package com.bwing;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import android.content.Intent;
import android.content.res.Configuration;


public class MainActivity extends ReactActivity {
    //react-native-screens override
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(null);
    }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
      super.onConfigurationChanged(newConfig);
      Intent intent = new Intent("onConfigurationChanged");
      intent.putExtra("newConfig", newConfig);
      this.sendBroadcast(intent);
  }


  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Bwing";
  }
}
