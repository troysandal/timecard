package com.troysandal.endurocomputer;

import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    // Text scale bounds. Keep in sync with MIN_TEXT_SCALE / MAX_TEXT_SCALE in src/lib/textScale.ts.
    private static final float MIN_TEXT_SCALE = 0.85f;
    private static final float MAX_TEXT_SCALE = 1.3f;

    // Smallest-width class that counts as a tablet (the standard sw600dp breakpoint).
    private static final int TABLET_MIN_SMALLEST_WIDTH_DP = 600;

    // Phones stay in portrait; tablets rotate freely. (The web build can't lock; its layout copes.)
    // Called again on every configuration change: the manifest's configChanges stops Android from
    // recreating the activity, so a foldable that is unfolded, or a window that is resized across
    // 600dp, would otherwise keep the lock it started with.
    private void applyOrientationLock(Configuration config) {
        boolean tablet = config.smallestScreenWidthDp >= TABLET_MIN_SMALLEST_WIDTH_DP;
        setRequestedOrientation(
            tablet ? ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED : ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        );
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        applyOrientationLock(newConfig);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Set before super.onCreate so the app never starts in landscape and then turns.
        applyOrientationLock(getResources().getConfiguration());
        super.onCreate(savedInstanceState);
        // Respect the system font size, clamped so dense screens stay usable.
        // fontScale is not in the manifest's configChanges, so changing the
        // system setting recreates the activity and this runs again.
        float fontScale = getResources().getConfiguration().fontScale;
        float clamped = Math.max(MIN_TEXT_SCALE, Math.min(MAX_TEXT_SCALE, fontScale));
        getBridge().getWebView().getSettings().setTextZoom(Math.round(clamped * 100));
    }
}
