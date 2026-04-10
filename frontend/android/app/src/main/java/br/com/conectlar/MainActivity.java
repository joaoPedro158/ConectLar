package br.com.conectlar;

import android.os.Bundle;
import android.view.View;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		View splashOverlay = findViewById(R.id.splash_overlay);
		if (splashOverlay == null) {
			return;
		}

		splashOverlay.postDelayed(() ->
			splashOverlay.animate()
				.alpha(0f)
				.setDuration(250)
				.withEndAction(() -> splashOverlay.setVisibility(View.GONE))
				.start(),
			1800
		);
	}
}
