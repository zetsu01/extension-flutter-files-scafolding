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

	const configDirectoryPath = path.join(libDirectoryPath, 'configs');
	await createDirectories(configDirectoryPath, ['routes', 'themes']);
	await Promise.all([
		createFile('routes', path.join(configDirectoryPath, 'routes')),
		createFile('dark_theme', path.join(configDirectoryPath, 'themes')),
		createFile('light_theme', path.join(configDirectoryPath, 'themes')),
		createFile('theme_config', path.join(configDirectoryPath, 'themes')),
	]);


	const contantsDirectoryPath = path.join(libDirectoryPath, 'constants');
	await createDirectories(contantsDirectoryPath, []);
	await Promise.all([
		createFile('api_path', contantsDirectoryPath),
		createFile('app_constants', contantsDirectoryPath),
		createFile('assets_path', contantsDirectoryPath),
	]);


	const widgetsDirectoryPath = path.join(libDirectoryPath, 'widgets');
	await createDirectories(widgetsDirectoryPath, []);
	await createFile('widgets', widgetsDirectoryPath);

	const utilsDirectoryPath = path.join(libDirectoryPath, 'utils');
	await createDirectories(utilsDirectoryPath, ['helpers', 'mixins', 'services', 'ui']);
	const utilsUiDirectoryPath = path.join(utilsDirectoryPath, 'ui', 'animation');
	await createDirectories(utilsUiDirectoryPath, []);
	await Promise.all([
		createFile('text_helper', path.join(utilsDirectoryPath, 'helpers')),
		createFile('validation_mixin', path.join(utilsDirectoryPath, 'mixins')),
		createFile('native_api_service', path.join(utilsDirectoryPath, 'services')),
		createFile('request_api_service', path.join(utilsDirectoryPath, 'services')),
		createFile('secure_storage_api_service', path.join(utilsDirectoryPath, 'services')),
		createFile('animations', path.join(utilsUiDirectoryPath)),
		createFile('app_dialogs', path.join(utilsDirectoryPath, 'ui')),
		createFile('ui_utils', utilsDirectoryPath),
	]);



	const coreDirectoryPath = path.join(libDirectoryPath, 'core');
	await createDirectories(coreDirectoryPath, ['settings', 'onboarding']);
	await createDirectories(path.join(coreDirectoryPath, 'auth'), ['login', 'register', 'forgot_password']);
	await Promise.all([
		createFile('application_settings', path.join(coreDirectoryPath, 'settings')),
		createFile('onboarding1', path.join(coreDirectoryPath, 'onboarding')),
		createFile('onboarding2', path.join(coreDirectoryPath, 'onboarding')),
		createFile('onboarding3', path.join(coreDirectoryPath, 'onboarding')),
	]);


	const featuresDirectoryPath = path.join(libDirectoryPath, 'features');
	await createDirectories(featuresDirectoryPath, []);
	const featuresHomeDirectoryPath = path.join(libDirectoryPath, 'features', 'home');
	await createDirectories(featuresHomeDirectoryPath, ['models', 'repositories', 'screens', 'widgets']);
	Promise.all([
		await createFile('model1', path.join(featuresHomeDirectoryPath, 'models')),
		createFile('repositorie', path.join(featuresHomeDirectoryPath, 'repositories')),
		createFile('home_screen', path.join(featuresHomeDirectoryPath, 'screens')),
		createFile('widget', path.join(featuresHomeDirectoryPath, 'widgets')),
	]);


	if (!existsSync(assetsDirectoryPath)) {
		createDirectories(assetsDirectoryPath, ['images', 'html', 'i18n']);
	}

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