# Shmui-JUCE Integration Plan

A guide for implementing ElevenLabs UI audio visualization components in JUCE C++.

---

## Executive Summary

**Can shmui help you build JUCE components faster?** Yes, significantly.

While the React/TypeScript code isn't directly portable, shmui provides:

- **Proven algorithms** for audio visualization that you can translate to C++
- **Tuned constants** (FFT sizes, smoothing factors, animation speeds) that took iteration to get right
- **Visual targets** - you know exactly what the end result should look like
- **State machine patterns** for handling listening/talking/thinking states

You're not starting from scratch - you're translating a working reference implementation.

---

## What Transfers vs. What Doesn't

### Directly Transferable (90% of the work)

| Concept | Shmui Source | JUCE Target |
|---------|--------------|-------------|
| FFT analysis | Web Audio API AnalyserNode | `juce::dsp::FFT` |
| RMS calculation | Manual loop over frequency data | Same algorithm |
| Exponential smoothing | `current += (target - current) * 0.2` | Identical in C++ |
| Animation timing | `requestAnimationFrame` + delta time | `juce::Timer` or `repaint()` |
| Shader math | GLSL fragment shader | `juce::OpenGLShaderProgram` |
| State machines | React useState + effects | C++ enum + member variables |

### Requires Adaptation

| Concept | Shmui Approach | JUCE Alternative |
|---------|----------------|------------------|
| 3D rendering | Three.js + React Three Fiber | `juce::OpenGLContext` or 2D approximation |
| SVG rendering | Native browser SVG | `juce::Path` + `juce::Graphics` |
| CSS animations | Tailwind + Framer Motion | Manual interpolation in `paint()` |
| Async audio loading | HTML5 Audio element | `juce::AudioFormatReader` |

---

## Implementation Roadmap

### Phase 1: Core Audio Analysis Engine (Week 1)

Build the shared DSP foundation that all visualizations will use.

#### 1.1 FFT Processor

```cpp
class AudioAnalyzer : public juce::AudioIODeviceCallback {
public:
    static constexpr int fftOrder = 8;  // 256 samples
    static constexpr int fftSize = 1 << fftOrder;

    void audioDeviceIOCallbackWithContext(
        const float* const* inputChannelData,
        int numInputChannels,
        float* const* outputChannelData,
        int numOutputChannels,
        int numSamples,
        const juce::AudioIODeviceCallbackContext& context) override;

    // Get frequency data normalized to 0-1
    void getFrequencyData(std::vector<float>& outData);

private:
    juce::dsp::FFT fft{fftOrder};
    std::array<float, fftSize * 2> fftData;
    juce::CriticalSection lock;
};
```

**Key constants from shmui:**
- `fftSize`: 256 for waveforms, 2048 for detailed frequency bands
- `smoothingTimeConstant`: 0.8 for smooth visualization, 0 for responsive
- Frequency range: 5% to 40% of bins for voice-focused display

#### 1.2 Volume Meter

```cpp
float calculateRMS(const float* samples, int numSamples) {
    float sum = 0.0f;
    for (int i = 0; i < numSamples; i++) {
        sum += samples[i] * samples[i];
    }
    return std::sqrt(sum / numSamples);
}

// Decibel normalization (from bar-visualizer.tsx)
float normalizeDb(float value) {
    const float minDb = -100.0f;
    const float maxDb = -10.0f;
    float db = 1.0f - (std::max(minDb, std::min(maxDb, value)) * -1.0f) / 100.0f;
    return std::sqrt(db);  // Perceptual scaling
}
```

---

### Phase 2: Waveform Visualizer (Week 2)

The scrolling waveform is the most reusable component.

#### 2.1 Data Structure

```cpp
struct WaveformBar {
    float x;
    float height;  // 0-1 normalized
    float alpha;   // 0.3 to 1.0
};

class WaveformVisualizer : public juce::Component, public juce::Timer {
    std::vector<WaveformBar> bars;
    float scrollSpeed = 50.0f;  // pixels per second
    int historySize = 100;

    void timerCallback() override;
    void paint(juce::Graphics& g) override;
};
```

#### 2.2 Rendering Algorithm

```cpp
void WaveformVisualizer::paint(juce::Graphics& g) {
    const float barWidth = 2.0f;
    const float gap = 1.0f;
    const float centerY = getHeight() / 2.0f;
    const float maxHeight = getHeight() * 0.8f;

    for (const auto& bar : bars) {
        float height = std::max(4.0f, bar.height * maxHeight);
        float y = centerY - height / 2.0f;

        g.setColour(colour.withAlpha(bar.alpha));
        g.fillRoundedRectangle(bar.x, y, barWidth, height, 1.0f);
    }

    // Edge fade gradient
    applyEdgeFade(g);
}
```

#### 2.3 Mirrored/Symmetric Mode

From `waveform.tsx` - creates visually balanced display:

```cpp
std::vector<float> createMirroredData(const std::vector<float>& input) {
    std::vector<float> result;
    int half = input.size() / 2;

    // Left side (reversed)
    for (int i = half - 1; i >= 0; i--) {
        result.push_back(input[i]);
    }
    // Right side (normal)
    for (int i = 0; i < half; i++) {
        result.push_back(input[i]);
    }
    return result;
}
```

---

### Phase 3: Bar Visualizer (Week 3)

Multi-band frequency analyzer with state-based animations.

#### 3.1 Frequency Band Splitting

```cpp
std::vector<float> splitIntoBands(
    const std::vector<float>& fftData,
    int numBands,
    int loPass = 100,
    int hiPass = 600
) {
    std::vector<float> bands(numBands);
    int sliceLength = hiPass - loPass;
    int chunkSize = (sliceLength + numBands - 1) / numBands;

    for (int i = 0; i < numBands; i++) {
        float sum = 0;
        int count = 0;
        int start = loPass + i * chunkSize;
        int end = std::min(loPass + (i + 1) * chunkSize, hiPass);

        for (int j = start; j < end; j++) {
            sum += normalizeDb(fftData[j]);
            count++;
        }
        bands[i] = count > 0 ? sum / count : 0;
    }
    return bands;
}
```

#### 3.2 State Machine

```cpp
enum class AgentState { Idle, Connecting, Listening, Thinking, Talking };

class BarVisualizer : public juce::Component {
    AgentState state = AgentState::Idle;
    int animationStep = 0;

    // From bar-visualizer.tsx
    int getAnimationInterval() {
        switch (state) {
            case AgentState::Connecting: return 2000 / barCount;
            case AgentState::Thinking:   return 150;
            case AgentState::Listening:  return 500;
            default:                     return 1000;
        }
    }
};
```

---

### Phase 4: Orb Visualization (Week 4-5)

The most complex component - requires OpenGL shaders.

#### 4.1 Architecture Decision

**Option A: Full OpenGL Port (Recommended)**
- Port GLSL shaders directly to JUCE's `OpenGLShaderProgram`
- Nearly identical visual result
- Requires OpenGL setup

**Option B: 2D Approximation**
- Use `juce::Path` with gradients
- Simpler but less dynamic
- Good for fallback

#### 4.2 Shader Port Structure

```cpp
class OrbComponent : public juce::Component,
                     public juce::OpenGLRenderer {
public:
    void newOpenGLContextCreated() override {
        // Compile shaders from orb.tsx GLSL code
        shader = std::make_unique<juce::OpenGLShaderProgram>(openGLContext);
        shader->addVertexShader(vertexShader);
        shader->addFragmentShader(fragmentShader);
        shader->link();
    }

    void renderOpenGL() override {
        // Update uniforms
        shader->setUniform("uTime", time);
        shader->setUniform("uInputVolume", smoothedInput);
        shader->setUniform("uOutputVolume", smoothedOutput);
        // ... draw quad
    }

private:
    float smoothedInput = 0.0f;
    float smoothedOutput = 0.0f;
    static constexpr float smoothingFactor = 0.2f;
};
```

#### 4.3 Key Shader Algorithms

**Polar coordinate system:**
```glsl
vec2 uv = vUv * 2.0 - 1.0;
float radius = length(uv);
float theta = atan(uv.y, uv.x);
```

**2D noise function (transfer directly):**
```glsl
vec2 hash2(vec2 p) {
    return fract(sin(vec2(
        dot(p, vec2(127.1, 311.7)),
        dot(p, vec2(269.5, 183.3))
    )) * 43758.5453);
}
```

**State-based animation targets:**
```cpp
void updateTargets() {
    float t = getTime();
    switch (state) {
        case AgentState::Idle:
            targetIn = 0.0f;
            targetOut = 0.3f;
            break;
        case AgentState::Listening:
            targetIn = juce::jlimit(0.0f, 1.0f,
                0.55f + std::sin(t * 3.2f) * 0.35f);
            targetOut = 0.45f;
            break;
        case AgentState::Talking:
            targetIn = juce::jlimit(0.0f, 1.0f,
                0.65f + std::sin(t * 4.8f) * 0.22f);
            targetOut = juce::jlimit(0.0f, 1.0f,
                0.75f + std::sin(t * 3.6f) * 0.22f);
            break;
        // ...
    }

    // Exponential smoothing
    smoothedInput += (targetIn - smoothedInput) * smoothingFactor;
    smoothedOutput += (targetOut - smoothedOutput) * smoothingFactor;
}
```

---

### Phase 5: Matrix Display (Week 6)

LED-style matrix with frame-based animations.

#### 5.1 Core Data Structure

```cpp
using Frame = std::vector<std::vector<float>>;

Frame createEmptyFrame(int rows, int cols) {
    return Frame(rows, std::vector<float>(cols, 0.0f));
}
```

#### 5.2 VU Meter Algorithm

```cpp
Frame createVUMeter(int columns, const std::vector<float>& levels) {
    const int rows = 7;
    Frame frame = createEmptyFrame(rows, columns);

    for (int col = 0; col < std::min(columns, (int)levels.size()); col++) {
        float level = juce::jlimit(0.0f, 1.0f, levels[col]);
        int height = static_cast<int>(level * rows);

        for (int row = 0; row < rows; row++) {
            int rowFromBottom = rows - 1 - row;
            if (rowFromBottom < height) {
                // Brightness gradient
                float brightness;
                if (row < rows * 0.3f) brightness = 1.0f;
                else if (row < rows * 0.6f) brightness = 0.8f;
                else brightness = 0.6f;
                frame[row][col] = brightness;
            }
        }
    }
    return frame;
}
```

#### 5.3 Animation System

```cpp
class MatrixAnimation {
    std::vector<Frame> frames;
    int currentFrame = 0;
    float accumulator = 0;
    float fps = 12.0f;
    bool loop = true;

    void update(float deltaTime) {
        accumulator += deltaTime;
        float frameInterval = 1.0f / fps;

        while (accumulator >= frameInterval) {
            accumulator -= frameInterval;
            currentFrame++;
            if (currentFrame >= frames.size()) {
                currentFrame = loop ? 0 : frames.size() - 1;
            }
        }
    }
};
```

#### 5.4 LED Rendering

```cpp
void MatrixDisplay::paint(juce::Graphics& g) {
    const float ledSize = 10.0f;
    const float gap = 2.0f;

    for (int row = 0; row < rows; row++) {
        for (int col = 0; col < cols; col++) {
            float brightness = currentFrame[row][col];
            float x = col * (ledSize + gap);
            float y = row * (ledSize + gap);

            if (brightness > 0.05f) {
                // Active LED with glow
                auto colour = ledColour.withAlpha(brightness);

                // Glow effect
                g.setColour(colour.withAlpha(0.3f));
                g.fillEllipse(x - 2, y - 2, ledSize + 4, ledSize + 4);

                // LED body
                g.setColour(colour);
                g.fillEllipse(x, y, ledSize, ledSize);
            } else {
                // Inactive LED
                g.setColour(ledColour.withAlpha(0.1f));
                g.fillEllipse(x, y, ledSize, ledSize);
            }
        }
    }
}
```

---

### Phase 6: Audio Player Controls (Week 7)

Standard transport with scrubbing and speed control.

#### 6.1 State Management

```cpp
class AudioPlayerState {
public:
    float currentTime = 0;
    float duration = 0;
    bool isPlaying = false;
    bool isBuffering = false;
    float playbackRate = 1.0f;

    static constexpr std::array<float, 8> playbackSpeeds = {
        0.25f, 0.5f, 0.75f, 1.0f, 1.25f, 1.5f, 1.75f, 2.0f
    };
};
```

#### 6.2 Time Formatting

```cpp
juce::String formatTime(float seconds) {
    int hrs = static_cast<int>(seconds / 3600);
    int mins = static_cast<int>(seconds) % 3600 / 60;
    int secs = static_cast<int>(seconds) % 60;

    if (hrs > 0)
        return juce::String::formatted("%d:%02d:%02d", hrs, mins, secs);
    else
        return juce::String::formatted("%d:%02d", mins, secs);
}
```

#### 6.3 Scrubber with Pause/Resume

```cpp
class Scrubber : public juce::Slider {
    bool wasPlayingBeforeSeek = false;

    void mouseDown(const juce::MouseEvent& e) override {
        wasPlayingBeforeSeek = audioPlayer->isPlaying();
        audioPlayer->pause();
        Slider::mouseDown(e);
    }

    void mouseUp(const juce::MouseEvent& e) override {
        Slider::mouseUp(e);
        if (wasPlayingBeforeSeek)
            audioPlayer->play();
    }
};
```

---

## Critical Constants Reference

These values have been tuned in shmui - use them as starting points:

### Audio Analysis
| Constant | Value | Purpose |
|----------|-------|---------|
| `fftSize` (waveform) | 256 | Balance between time/frequency resolution |
| `fftSize` (spectrum) | 2048 | High frequency resolution |
| `smoothingTimeConstant` | 0.8 | Smooth visual updates |
| `frequencyRangeStart` | 5% of bins | Skip DC and very low frequencies |
| `frequencyRangeEnd` | 40% of bins | Human voice focus |

### Animation
| Constant | Value | Purpose |
|----------|-------|---------|
| `smoothingFactor` | 0.2 | Volume smoothing speed |
| `transitionStep` | 0.02 per frame | State transition speed |
| `fadeStep` | 0.03 per frame | Fade out speed |
| `colorLerpFactor` | 0.08 | Color transition smoothness |

### Visual
| Constant | Value | Purpose |
|----------|-------|---------|
| `minBarHeight` | 4px | Minimum visible bar |
| `heightScale` | 0.8 | Max 80% of container |
| `alphaRange` | 0.3 to 1.0 | Bar opacity by amplitude |
| `ledSize` | 10px | Matrix LED diameter |
| `ledGap` | 2px | Space between LEDs |

---

## File Structure for JUCE Project

```
YourJuceProject/
├── Source/
│   ├── Audio/
│   │   ├── AudioAnalyzer.h/cpp      # FFT + RMS
│   │   └── AudioPlayerState.h/cpp   # Playback state
│   ├── Components/
│   │   ├── WaveformVisualizer.h/cpp
│   │   ├── BarVisualizer.h/cpp
│   │   ├── OrbVisualizer.h/cpp
│   │   ├── MatrixDisplay.h/cpp
│   │   └── AudioPlayerControls.h/cpp
│   ├── Shaders/                     # For orb
│   │   ├── OrbVertex.glsl
│   │   └── OrbFragment.glsl
│   └── Utils/
│       ├── Interpolation.h          # Smoothing functions
│       └── ColorUtils.h             # Color ramps
├── Resources/
│   └── Textures/
│       └── perlin.png               # For orb noise
```

---

## Testing Strategy

### 1. Visual Comparison
- Screenshot shmui components in different states
- Compare your JUCE output side-by-side
- Adjust constants until visual parity

### 2. Audio Response Validation
- Test with known audio files (silence, speech, music)
- Verify frequency response matches shmui behavior
- Check state transitions feel natural

### 3. Performance Benchmarks
- Target 60fps rendering
- Monitor CPU usage during animation
- Profile shader performance on target hardware

---

## Estimated Timeline

| Phase | Component | Duration | Dependencies |
|-------|-----------|----------|--------------|
| 1 | Audio Analysis Engine | 1 week | None |
| 2 | Waveform Visualizer | 1 week | Phase 1 |
| 3 | Bar Visualizer | 1 week | Phase 1 |
| 4 | Orb Visualization | 2 weeks | Phase 1 |
| 5 | Matrix Display | 1 week | Phase 1 |
| 6 | Audio Player Controls | 1 week | Phase 1 |
| 7 | Integration & Polish | 1 week | All |

**Total: 8 weeks** for full component library

---

## Quick Wins (Start Here)

If you need something working fast:

1. **Waveform** - Simplest to implement, most reusable
2. **Bar Visualizer** - Straightforward frequency bands
3. **Matrix** - No DSP needed, just frame rendering

Save the **Orb** for last - it requires OpenGL and is the most complex.

---

## Resources

### Shmui Reference Files
- `/home/user/shmui/apps/www/registry/elevenlabs-ui/ui/waveform.tsx`
- `/home/user/shmui/apps/www/registry/elevenlabs-ui/ui/orb.tsx`
- `/home/user/shmui/apps/www/registry/elevenlabs-ui/ui/bar-visualizer.tsx`
- `/home/user/shmui/apps/www/registry/elevenlabs-ui/ui/matrix.tsx`
- `/home/user/shmui/apps/www/registry/elevenlabs-ui/ui/audio-player.tsx`

### JUCE Documentation
- [juce::dsp::FFT](https://docs.juce.com/master/classdsp_1_1FFT.html)
- [juce::OpenGLContext](https://docs.juce.com/master/classOpenGLContext.html)
- [juce::AudioIODeviceCallback](https://docs.juce.com/master/classAudioIODeviceCallback.html)

---

## Conclusion

Shmui serves as an excellent **algorithmic blueprint** for JUCE implementation. The math, timing, and visual design patterns transfer directly - you're essentially doing a language port with framework adaptation rather than original design work.

The biggest time savings come from:
1. **Tuned constants** - no guessing animation speeds or smoothing factors
2. **Proven algorithms** - noise functions, color ramps, frequency analysis
3. **Visual targets** - you know exactly what success looks like

Start with the waveform visualizer as a proof of concept, then expand from there.
