// Web Audio API를 사용해서 프로그래밍적으로 사운드 생성
class AudioGenerator {
  private audioContext: AudioContext | null = null;
  private isPlayingTheme = false;
  private currentOscillators: OscillatorNode[] = [];
  private isMuted = false;

  constructor() {
    // 초기에는 AudioContext를 생성하지 않음
    this.audioContext = null;
  }

  private async initAudioContext() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // 브라우저 자동재생 정책으로 인해 suspended 상태일 수 있음
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
        
        console.log('AudioContext initialized:', this.audioContext.state);
      } catch (error) {
        console.error('Failed to initialize AudioContext:', error);
      }
    }
  }

  // 음악의 총 길이 계산
  getTetrisThemeDuration(): number {
    // 메인 멜로디의 총 길이 계산
    const melody = [
      // 첫 번째 섹션
      { freq: 659.25, duration: 0.5 }, // E5
      { freq: 493.88, duration: 0.25 }, // B4
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 587.33, duration: 0.5 }, // D5
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 493.88, duration: 0.25 }, // B4
      { freq: 440.00, duration: 0.5 }, // A4
      { freq: 440.00, duration: 0.25 }, // A4
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 659.25, duration: 0.5 }, // E5
      { freq: 587.33, duration: 0.25 }, // D5
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 493.88, duration: 0.75 }, // B4
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 587.33, duration: 0.5 }, // D5
      { freq: 659.25, duration: 0.5 }, // E5
      { freq: 523.25, duration: 0.5 }, // C5
      { freq: 440.00, duration: 0.5 }, // A4
      { freq: 440.00, duration: 1.0 }, // A4
      // 두 번째 섹션
      { freq: 587.33, duration: 0.75 }, // D5
      { freq: 698.46, duration: 0.25 }, // F5
      { freq: 880.00, duration: 0.5 }, // A5
      { freq: 783.99, duration: 0.25 }, // G5
      { freq: 698.46, duration: 0.25 }, // F5
      { freq: 659.25, duration: 0.75 }, // E5
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 659.25, duration: 0.5 }, // E5
      { freq: 587.33, duration: 0.25 }, // D5
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 493.88, duration: 0.75 }, // B4
      { freq: 493.88, duration: 0.25 }, // B4
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 587.33, duration: 0.5 }, // D5
      { freq: 659.25, duration: 0.5 }, // E5
      { freq: 523.25, duration: 0.5 }, // C5
      { freq: 440.00, duration: 0.5 }, // A4
      { freq: 440.00, duration: 1.0 }, // A4
    ];
    
    return melody.reduce((total, note) => total + note.duration, 0) * 1000; // 밀리초로 변환
  }

  // 테트리스 테마 멜로디 (클래식 버전)
  async playTetrisTheme() {
    // 이미 재생 중이면 중복 재생 방지
    if (this.isPlayingTheme) {
      return;
    }
    
    // 오디오 컨텍스트 초기화
    await this.initAudioContext();
    
    if (!this.audioContext) {
      console.error('AudioContext initialization failed');
      return;
    }
    
    this.isPlayingTheme = true;
    
    // 기존 오실레이터들 정리
    this.currentOscillators.forEach(oscillator => {
      try {
        oscillator.stop();
      } catch (e) {
        // 이미 중지된 오실레이터는 무시
      }
    });
    this.currentOscillators = [];
    
    console.log('Playing Tetris theme...');

    let time = this.audioContext.currentTime;
    const noteVolume = 0.05;
    const bassVolume = 0.06;
    const harmonyVolume = 0.04;

    // 메인 멜로디 (Korobeiniki 기반)
    const melody = [
      // 첫 번째 섹션
      { freq: 659.25, duration: 0.5 }, // E5
      { freq: 493.88, duration: 0.25 }, // B4
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 587.33, duration: 0.5 }, // D5
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 493.88, duration: 0.25 }, // B4
      { freq: 440.00, duration: 0.5 }, // A4
      { freq: 440.00, duration: 0.25 }, // A4
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 659.25, duration: 0.5 }, // E5
      { freq: 587.33, duration: 0.25 }, // D5
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 493.88, duration: 0.75 }, // B4
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 587.33, duration: 0.5 }, // D5
      { freq: 659.25, duration: 0.5 }, // E5
      { freq: 523.25, duration: 0.5 }, // C5
      { freq: 440.00, duration: 0.5 }, // A4
      { freq: 440.00, duration: 1.0 }, // A4

      // 두 번째 섹션
      { freq: 587.33, duration: 0.75 }, // D5
      { freq: 698.46, duration: 0.25 }, // F5
      { freq: 880.00, duration: 0.5 }, // A5
      { freq: 783.99, duration: 0.25 }, // G5
      { freq: 698.46, duration: 0.25 }, // F5
      { freq: 659.25, duration: 0.75 }, // E5
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 659.25, duration: 0.5 }, // E5
      { freq: 587.33, duration: 0.25 }, // D5
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 493.88, duration: 0.75 }, // B4
      { freq: 493.88, duration: 0.25 }, // B4
      { freq: 523.25, duration: 0.25 }, // C5
      { freq: 587.33, duration: 0.5 }, // D5
      { freq: 659.25, duration: 0.5 }, // E5
      { freq: 523.25, duration: 0.5 }, // C5
      { freq: 440.00, duration: 0.5 }, // A4
      { freq: 440.00, duration: 1.0 }, // A4
    ];

    // 베이스 라인 (낮은 옥타브)
    const bassLine = [
      { freq: 110.00, duration: 1.0 }, // A2
      { freq: 164.81, duration: 1.0 }, // E3
      { freq: 110.00, duration: 1.0 }, // A2
      { freq: 164.81, duration: 1.0 }, // E3
      { freq: 130.81, duration: 1.0 }, // C3
      { freq: 196.00, duration: 1.0 }, // G3
      { freq: 130.81, duration: 1.0 }, // C3
      { freq: 196.00, duration: 1.0 }, // G3
      { freq: 146.83, duration: 1.0 }, // D3
      { freq: 220.00, duration: 1.0 }, // A3
      { freq: 146.83, duration: 1.0 }, // D3
      { freq: 220.00, duration: 1.0 }, // A3
      { freq: 164.81, duration: 1.0 }, // E3
      { freq: 246.94, duration: 1.0 }, // B3
      { freq: 164.81, duration: 1.0 }, // E3
      { freq: 246.94, duration: 1.0 }, // B3
    ];

    // 화음 (중간 음역)
    const harmony = [
      { freq: 523.25, duration: 2.0 }, // C5
      { freq: 659.25, duration: 2.0 }, // E5
      { freq: 440.00, duration: 2.0 }, // A4
      { freq: 493.88, duration: 2.0 }, // B4
      { freq: 587.33, duration: 2.0 }, // D5
      { freq: 698.46, duration: 2.0 }, // F5
      { freq: 523.25, duration: 2.0 }, // C5
      { freq: 659.25, duration: 2.0 }, // E5
    ];

    // 멜로디 재생 (음소거 상태 체크)
    melody.forEach((note) => {
      this.playNote(note.freq, time, note.duration, noteVolume, 'square', true);
      time += note.duration;
    });

    // 베이스 라인 재생 (동시에, 음소거 상태 체크)
    let bassTime = this.audioContext.currentTime;
    bassLine.forEach((note) => {
      this.playNote(note.freq, bassTime, note.duration, bassVolume, 'sine', true);
      bassTime += note.duration;
    });

    // 화음 재생 (동시에, 음소거 상태 체크)
    let harmonyTime = this.audioContext.currentTime;
    harmony.forEach((note) => {
      this.playNote(note.freq, harmonyTime, note.duration, harmonyVolume, 'triangle', true);
      harmonyTime += note.duration;
    });

    // 음악 끝날 때 플래그 리셋
    const totalDuration = this.getTetrisThemeDuration();
    setTimeout(() => {
      this.isPlayingTheme = false;
    }, totalDuration);
  }

  // 드롭 사운드
  async playDropSound() {
    await this.initAudioContext();
    if (!this.audioContext) return;
    this.playNote(200, this.audioContext.currentTime, 0.1, 0.008);
  }

  // 라인 클리어 사운드
  async playLineClearSound() {
    await this.initAudioContext();
    if (!this.audioContext) return;
    const frequencies = [440, 554.37, 659.25, 880];
    let time = this.audioContext.currentTime;
    
    frequencies.forEach((freq, index) => {
      this.playNote(freq, time + index * 0.1, 0.2, 0.008);
    });
  }

  // 게임 오버 사운드
  async playGameOverSound() {
    await this.initAudioContext();
    if (!this.audioContext) return;
    const frequencies = [659.25, 622.25, 587.33, 554.37, 523.25, 493.88, 466.16, 440];
    let time = this.audioContext.currentTime;
    
    frequencies.forEach((freq, index) => {
      this.playNote(freq, time + index * 0.15, 0.3, 0.008);
    });
  }

  private playNote(frequency: number, startTime: number, duration: number, volume: number = 0.3, waveType: OscillatorType = 'square', respectMute: boolean = false) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.type = waveType;

    // 음소거 상태 체크 (테마 음악인 경우만)
    let finalVolume = volume;
    if (respectMute) {
      // DOM에서 현재 음소거 상태 확인
      const audioProvider = document.querySelector('[data-audio-muted]');
      const isMuted = audioProvider?.getAttribute('data-audio-muted') === 'true';
      if (isMuted) {
        finalVolume = 0;
      }
    }

    // 볼륨 엔벨로프 (부드러운 시작과 끝)
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(finalVolume, startTime + 0.02);
    gainNode.gain.setValueAtTime(finalVolume * 0.8, startTime + duration * 0.7);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    // 오실레이터를 배열에 추가하여 추적
    this.currentOscillators.push(oscillator);

    // 오실레이터가 끝나면 배열에서 제거
    oscillator.addEventListener('ended', () => {
      const index = this.currentOscillators.indexOf(oscillator);
      if (index > -1) {
        this.currentOscillators.splice(index, 1);
      }
    });

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  // 테마 음악 중지
  stopTetrisTheme() {
    this.isPlayingTheme = false;
    // 현재 재생 중인 모든 오실레이터 중지
    this.currentOscillators.forEach(oscillator => {
      try {
        oscillator.stop();
      } catch (e) {
        // 이미 중지된 오실레이터는 무시
      }
    });
    this.currentOscillators = [];
  }

  // 음소거 설정
  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  // 음소거 상태 가져오기
  getMuted(): boolean {
    return this.isMuted;
  }

  // 사용자 상호작용 시 AudioContext 재개
  async resumeAudioContext() {
    await this.initAudioContext();
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
      console.log('AudioContext resumed');
    }
  }
}

export const audioGenerator = new AudioGenerator();