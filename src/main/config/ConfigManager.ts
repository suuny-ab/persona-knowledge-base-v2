import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

export interface AppConfig {
  obsidianPath: string;
  deepseekApiKey: string;
}

const DEFAULT_CONFIG: AppConfig = {
  obsidianPath: '',
  deepseekApiKey: '',
};

class ConfigManager {
  private configPath: string;
  private config: AppConfig;

  constructor() {
    // 配置文件存储在 userData 目录
    const userDataPath = app.getPath('userData');
    this.configPath = path.join(userDataPath, 'config.json');
    this.config = DEFAULT_CONFIG;

    // 确保配置目录存在
    const configDir = path.dirname(this.configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // 加载配置
    this.load();
  }

  private load(): void {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = fs.readFileSync(this.configPath, 'utf-8');
        this.config = JSON.parse(configData);
        console.log('Config loaded successfully');
      } else {
        // 配置文件不存在,使用默认配置
        this.save();
        console.log('Config file not found, using default config');
      }
    } catch (error) {
      console.error('Failed to load config:', error);
      this.config = { ...DEFAULT_CONFIG };
    }
  }

  private save(): void {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf-8');
      console.log('Config saved successfully');
    } catch (error) {
      console.error('Failed to save config:', error);
      throw error;
    }
  }

  public getConfig(): AppConfig {
    return { ...this.config };
  }

  public setConfig(newConfig: Partial<AppConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.save();
  }

  public updateObsidianPath(obsidianPath: string): void {
    this.config.obsidianPath = obsidianPath;
    this.save();
  }

  public updateDeepseekApiKey(apiKey: string): void {
    this.config.deepseekApiKey = apiKey;
    this.save();
  }
}

// 导出单例实例
export const configManager = new ConfigManager();
