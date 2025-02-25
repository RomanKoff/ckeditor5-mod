#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* eslint-env node */

import upath from 'upath';
import fs from 'fs-extra';
import { Listr } from 'listr2';
import { tools } from '@ckeditor/ckeditor5-dev-utils';
import parseArguments from './utils/parsearguments.mjs';
import { CKEDITOR5_ROOT_PATH } from '../constants.mjs';
import { CDN_S3_BUCKET, S3_COPY_ARGS, RELEASE_CDN_DIRECTORY } from './utils/constants.mjs';
import getCdnVersion from './utils/getcdnversion.mjs';
import getListrOptions from './utils/getlistroptions.mjs';

const cliArguments = parseArguments( process.argv.slice( 2 ) );
const { version: packageJsonVersion } = fs.readJsonSync( upath.join( CKEDITOR5_ROOT_PATH, './package.json' ) );
const cdnVersion = getCdnVersion( cliArguments, packageJsonVersion );

const tasks = new Listr( [
	{
		title: 'Upload files to CDN.',
		task: async () => {
			await tools.shExec(
				`aws s3 cp ./${ RELEASE_CDN_DIRECTORY }/ s3://${ CDN_S3_BUCKET }/ckeditor5/${ cdnVersion }/ ${ S3_COPY_ARGS } \
				 --exclude "*" --include "*.js" --content-type 'text/javascript; charset=utf-8'`,
				{ verbosity: 'error', async: true }
			);
			await tools.shExec(
				`aws s3 cp ./${ RELEASE_CDN_DIRECTORY }/ s3://${ CDN_S3_BUCKET }/ckeditor5/${ cdnVersion }/ ${ S3_COPY_ARGS } \
				 --exclude "*" --include "*.ts" --content-type 'application/typescript; charset=utf-8'`,
				{ verbosity: 'error', async: true }
			);
			await tools.shExec(
				`aws s3 cp ./${ RELEASE_CDN_DIRECTORY }/ s3://${ CDN_S3_BUCKET }/ckeditor5/${ cdnVersion }/ ${ S3_COPY_ARGS } \
				 --exclude "*" --include "*.css" --content-type 'text/css; charset=utf-8'`,
				{ verbosity: 'error', async: true }
			);
			await tools.shExec(
				`aws s3 cp ./${ RELEASE_CDN_DIRECTORY }/ s3://${ CDN_S3_BUCKET }/ckeditor5/${ cdnVersion }/ ${ S3_COPY_ARGS } \
				 --exclude "*" --include "*.zip" --content-type 'application/zip'`,
				{ verbosity: 'error', async: true }
			);
			await tools.shExec(
				`aws s3 cp ./${ RELEASE_CDN_DIRECTORY }/ s3://${ CDN_S3_BUCKET }/ckeditor5/${ cdnVersion }/ ${ S3_COPY_ARGS } \
				--exclude "*" --include "*.map" --content-type 'application/json; charset=utf-8'`,
				{ verbosity: 'error', async: true }
			);
		}
	}
], getListrOptions( cliArguments ) );

( async () => {
	try {
		await tasks.run();
	} catch ( err ) {
		process.exitCode = 1;

		console.error( err );
	}
} )();
