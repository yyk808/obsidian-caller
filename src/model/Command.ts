export class Command {
  constructor(exe?: string, args?: string, cwd?: string) {
    this.executable = exe ? exe : "";
    this.arguments = args? args : "";
    this.cwd = cwd ? cwd : "";
  }

  executable: string
  arguments: string
  cwd: string
}
