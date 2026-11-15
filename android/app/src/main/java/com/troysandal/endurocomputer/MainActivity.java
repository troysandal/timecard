package com.troysandal.endurocomputer;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    // Text scale bounds. Keep in sync with MIN_TEXT_SCALE / MAX_TEXT_SCALE in src/lib/textScale.ts.
    private static final float MIN_TEXT_SCALE = 0.85f;
    private static final float MAX_TEXT_SCALE = 1.3f;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Respect the system font size, clamped so dense screens stay usable.
        // fontScale is not in the manifest's configChanges, so changing the
        // system setting recreates the activity and this runs again.
        float fontScale = getResources().getConfiguration().fontScale;
        float clamped = Math.max(MIN_TEXT_SCALE, Math.min(MAX_TEXT_SCALE, fontScale));
        getBridge().getWebView().getSettings().setTextZoom(Math.round(clamped * 100));
    }
}
