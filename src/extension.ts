// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { existsSync, mkdir, writeFile } from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "flutter-files-scafolding" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('flutter-files-scafolding.flutter-files-scafold', async () => {
		// The code you place here will be executed every time your command is executed
		let projectPath: string;
		let libPath: string;

		if (vscode.workspace.workspaceFolders !== undefined) {
			libPath = path.join(vscode.workspace.workspaceFolders[0].uri.path, 'lib');
			projectPath = vscode.workspace.workspaceFolders[0].uri.path;
			if (!existsSync(libPath)) {
				vscode.window.showErrorMessage('🤯 Flutter lib directory is missing');
			}
			try {
				await generateFile(projectPath);
				vscode.window.showInformationMessage('🥳 Successfully Generated Scafoldind files ');
			} catch (error) {
				vscode.window.showErrorMessage(
					`🥵 Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
				);
			}
		}
		else {
			vscode.window.showErrorMessage('Can\'t genarate flutter  scafold files in empty directory');
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }


export async function generateFile(targetDirectory: string) {
	const assetsDirectoryPath = path.join(targetDirectory, 'assets');
	const libDirectoryPath = path.join(targetDirectory, 'lib');

	if (!existsSync(assetsDirectoryPath)) {
		createDirectories(assetsDirectoryPath, ['images', 'html', 'i18n']);
	} else {
		return;
	}


	const configDirectoryPath = path.join(libDirectoryPath, 'configs');
	await createDirectories(configDirectoryPath, ['routes', 'themes']);
	await createFile('routes', path.join(configDirectoryPath, 'routes'));
	await createFile('dark_theme', path.join(configDirectoryPath, 'themes'));
	await createFile('light_theme', path.join(configDirectoryPath, 'themes'));
	await createFile('theme_config', path.join(configDirectoryPath, 'themes'));

	const contantsDirectoryPath = path.join(libDirectoryPath, 'constants');
	await createDirectories(contantsDirectoryPath, []);
	await createFile('api_path', path.join(contantsDirectoryPath, 'constants'));
	await createFile('app_constants', path.join(contantsDirectoryPath, 'constants'));
	await createFile('assets_path', path.join(contantsDirectoryPath, 'constants'));

	const widgetsDirectoryPath = path.join(libDirectoryPath, 'widgets');
	await createDirectories(widgetsDirectoryPath, []);
	await createFile('widgets', path.join(widgetsDirectoryPath, 'widgets'));

	const utilsDirectoryPath = path.join(libDirectoryPath, 'utils');
	await createDirectories(utilsDirectoryPath, ['helpers', 'mixins', 'services', 'ui']);
	await createFile('text_helper', path.join(utilsDirectoryPath, 'mixins'));
	await createFile('validation_mixin', path.join(utilsDirectoryPath, 'themes'));
	await createFile('native_api_service', path.join(utilsDirectoryPath, 'services'));
	await createFile('request_api_service', path.join(utilsDirectoryPath, 'services'));
	await createFile('secure_storage_api_service', path.join(utilsDirectoryPath, 'services'));
	// 
	const utilsUiDirectoryPath = path.join(libDirectoryPath, 'utils', 'ui');
	await createDirectories(utilsUiDirectoryPath, ['animations']);
	await createFile('animations', path.join(utilsUiDirectoryPath, 'animations'));


	const coreDirectoryPath = path.join(libDirectoryPath, 'core');
	await createDirectories(coreDirectoryPath, ['auth', 'settings', 'onboarding']);

	const featuresDirectoryPath = path.join(libDirectoryPath, 'features');
	await createDirectories(featuresDirectoryPath, ['home']);

	const featuresHomeDirectoryPath = path.join(libDirectoryPath, 'features', 'home');
	await createDirectories(featuresHomeDirectoryPath, ['models', 'repositories', 'screens', 'widgets']);
}

export async function createDirectories(target: string, childDirectories: string[]): Promise<void> {
	await createDirectory(target);
	childDirectories.map(async (directory) => await createDirectory(path.join(target, directory)));
}

async function createDirectory(targetDirectory: string): Promise<void> {
	return new Promise((resolve, reject) => {
		mkdir(targetDirectory, (error) => {
			if (error) {
				reject(error);
			}
			resolve();
		});
	});
}

async function createFile(fileName: string, targetDirectory: string): Promise<void> {
	const filePath = path.join(targetDirectory, `${fileName}.dart`);
	return new Promise(async (resolve, reject) => {
		writeFile(filePath, defaultTemplate(), 'utf8', (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});

	function defaultTemplate(): string {
		return `// empty file; propose default content at the author`;
	}
}