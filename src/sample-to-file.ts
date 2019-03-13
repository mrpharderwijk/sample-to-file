import * as fs from 'fs';
import * as replaceInFile from 'replace-in-file';
import * as util from 'util';

class SampleToFile {
  private placeholder: RegExp;
  private value: string;
  private destFile: string;
  private srcFile: string;

  constructor(ph: string, value: string, srcFile: string, destFile: string) {
    const placeholder = `{{${ph}}}`;

    this.placeholder = new RegExp(placeholder, 'g');
    this.value = value;
    this.destFile = `${process.cwd()}/${destFile}`;
    this.srcFile = `${process.cwd()}/${srcFile}`;
  }

  public init() {
    this.fileExists().then(
      () => {
        // file exists so remove first
        this.removeFile().then(
          () => {
            // Log feedback to the user
            console.info(`${this.destFile} successfully removed!`);

            // process the whole flow
            this.processReplace();
          },
          (error: string) => {
            console.error('removeFile: ', error);
          },
        );
      },
      (error: string) => {
        // process the whole flow
        this.processReplace();
      },
    );
  }

  private fileExists() {
    return util.promisify(fs.access)(this.destFile);
  }

  /**
   * Remove the old destination file
   */
  private removeFile() {
    return util.promisify(fs.unlink)(this.destFile);
  }

  /**
   * Read the content of the sample file
   */
  private readFile() {
    return util.promisify(fs.readFile)(this.srcFile, 'utf8');
  }

  private writeFile(fileContent: string) {
    return util.promisify(fs.writeFile)(this.destFile, fileContent);
  }

  /**
   * Replace the template placeholder
   */
  private replacePlaceholder() {
    const options = {
      files: this.destFile,
      from: this.placeholder,
      to: this.value,
    };

    return replaceInFile(options);
  }

  /**
   * Complete flow of read, write and replacing
   */
  private processReplace() {
    // Read the source file
    this.readFile().then(
      (fileContent: string) => {
        // Write the new environment file with the source file content
        this.writeFile(fileContent).then(() => {
          // Replace the place holder in the environment file to the flagged host
          this.replacePlaceholder()
            .then((changes: string[]) => {
              console.info('Modified files:', changes.join(', '));
            })
            .catch((error: string) => {
              console.error('Error occurred:', error);
            });
        });
      },
      (error: string) => {
        console.error('readFile: ', error);
      },
    );
  }
}

/**
 * @Method: Returns the plural form of any noun.
 * @Param {string}
 * @Return {string}
 *
 * TODO: fix type of argv
 */
export function sampleToFile(argv: any): any {
  /**
   * check if the correct flags are set
   */
  if (!argv) {
    console.info(
      'Please define the correct flags. Mandatory flags are --host=http://localhost:666 --src=path/to/file.sample --dest=path/to/file.ts',
    );
  }

  if (!argv.ph) {
    console.info(
      'Please define a placeholder with the ph flag (e.g. --ph=testPlaceholder). The source file must contain this placeholder with double brackets (e.g. {{testPlaceholder}}). This is what will get replaced with the value defined in the value flag.',
    );
    return false;
  }

  if (!argv.value) {
    console.info('Please define a value with the value flag (e.g. --value=testValue).');
    return false;
  }

  if (!argv.src) {
    console.info('Please define a source file with the src flag (e.g. --src=path/to/file.sample)');
    return false;
  }

  if (!argv.dest) {
    console.info('Please define a destination file with the dest flag (e.g. --dest=path/to/file.ts)');
    return false;
  }

  return new SampleToFile(argv.ph, argv.value, argv.src, argv.dest);
}
