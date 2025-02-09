declare module '@portfolio-2025/prettier-config' {
  import { Config } from 'prettier'
  import { PluginConfig } from '@ianvs/prettier-plugin-sort-imports'

  const config: Config & PluginConfig
  export default config
}