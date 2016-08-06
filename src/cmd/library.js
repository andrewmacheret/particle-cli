
import ProjectProperties from './project_properties';
import pipeline from 'when/pipeline';
import {convertApiError} from './api';


/** Library add **/
export class LibraryAddCommand {
	constructor({ apiClient } = {}) {
		this.apiClient = apiClient;
	}
	run(site, { name, version = 'latest' } = {}) {
		this.site = site;
		this.projectProperties = new ProjectProperties(this.site.projectDir());
		return pipeline([
			() => this.ensureProjectExists(),
			() => this.loadProject(),
			() => this.fetchLibrary(name, version),
			(library) => this.addLibraryToProject(library),
			() => this.saveProject()
		]);
	}

	ensureProjectExists() {
		return this.projectExist().then(exists => {
			if (!exists) {
				return this.createProject();
			}
		});
	}

	projectExist() {
		return this.projectProperties.exists();
	}

	createProject() {
		// save a blank project.properties
		return this.projectProperties.save();
	}

	loadProject() {
		return this.projectProperties.load();
	}

	fetchLibrary(name, version) {
		return this.site.fetchingLibrary(this.apiClient.library(name, { version }), name, version)
		.catch(err => {
			throw this.apiError(err);
		});
	}

	apiError(err) {
		return convertApiError(err);
	}

	addLibraryToProject(library) {
		return pipeline([
			() => this.site.addedLibrary(library.name, library.version),
			() => this.projectProperties.addDependency(library.name, library.version)
		]);
	}

	saveProject() {
		return this.projectProperties.save();
	}
}
