/* ***** BEGIN LICENSE BLOCK ***** 
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the Tree Style Tab.
 *
 * The Initial Developer of the Original Code is SHIMODA Hiroshi.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s): SHIMODA Hiroshi <piro@p.club.ne.jp>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ******/
 
const EXPORTED_SYMBOLS = ['TreeStyleTabThemeManager']; 

const BASE = 'chrome://treestyletab/skin/';

Components.utils.import('resource://treestyletab-modules/utils.js');

function TreeStyleTabThemeManager(aWindow)
{
	this.window = aWindow;
	this._preLoadImagesForStyleDone = [];
	this._preLoadImagesForStyleDoneImages = [];
}
TreeStyleTabThemeManager.prototype = {
	destroy : function()
	{
		delete this.window;
	},

	set : function(aStyle, aPosition)
	{
		if (this._lastStyles)
			this._lastStyles.forEach(function(aStyle) {
				aStyle.parentNode.removeChild(aStyle);
			});
		this._lastStyles = null;

		var styles = [];
		switch (aStyle)
		{
			default:
				break;

			case 'plain':
			case 'flat':
			case 'mixed':
				styles.push(BASE+'square/base.css');
				if (aStyle != 'plain') {
					styles.push(BASE+'square/mixed.css');
					styles.push(BASE+'square/tab-surface.css');
				}
				if (aStyle != 'flat')
					styles.push(BASE+'square/dropshadow.css');
				styles.push(BASE+'platform-styled.css');
				styles.push(BASE+'square/platform.css');
				break;

			case 'vertigo':
				styles.push(BASE+'square/base.css');
				styles.push(BASE+'square/vertigo.css');
				styles.push(BASE+'platform-styled.css');
				styles.push(BASE+'square/platform.css');
				break;

			case 'metal':
				styles.push(BASE+'metal/base.css');
				styles.push(BASE+'metal/base-inactive.css');
				styles.push(BASE+'metal/tab.css');
				styles.push(BASE+'metal/aero.css');
				styles.push(BASE+'platform-styled.css');
				styles.push(BASE+'metal/platform.css');
				break;

			case 'sidebar':
				styles.push(BASE+'sidebar/base.css');
				styles.push(BASE+'sidebar/inactive.css');
				styles.push(BASE+'sidebar/aero.css');
				styles.push(BASE+'platform-styled.css');
				break;
		}

		if (styles.length) {
			this._lastStyles = styles.map(function(aStyle) {
				var d = this.window.document;
				var pi = d.createProcessingInstruction(
							'xml-stylesheet',
							'type="text/css" href="'+aStyle+'"'
						);
				d.insertBefore(pi, d.documentElement);
				return pi;
			}, this);
			this.preloadImages(aStyle, aPosition);
		}
	},

	preloadImages : function(aStyle, aPosition)
	{
		var key = aStyle+'-'+aPosition;
		if (!aStyle ||
			this._preLoadImagesForStyleDone.indexOf(key) > -1)
			return;
		this._preLoadImagesForStyleDone.push(key);

		var images = key in this._preLoadImages ?
				this._preLoadImages[key] :
				null ;
		if (!images) return;

		images.forEach(function(aImage) {
			if (this._preLoadImagesForStyleDoneImages.indexOf(aImage) > -1)
				return;

			(new this.window.Image()).src = aImage;
			this._preLoadImagesForStyleDoneImages.push(aImage);
		}, this);
	},

	_preLoadImages : {
		'metal-left' : [
			BASE+'metal/tab-active-l.png',
			BASE+'metal/tab-inactive-l.png',
			BASE+'metal/tab-active-selected-l.png',
			BASE+'metal/tab-inactive-selected-l.png',
			BASE+'metal/shadow-active-l.png',
			BASE+'metal/shadow-inactive-l.png'
		].concat(
			TreeStyleTabUtils.Comparator.compare(TreeStyleTabUtils.XULAppInfo.version, '3.5') >= 0 ?
				[
					BASE+'metal/tab-active-middle.png',
					BASE+'metal/tab-active-middle-selected.png',
					BASE+'metal/tab-inactive-middle.png',
					BASE+'metal/tab-inactive-middle-selected.png'
				] :
				[]
		),
		'metal-right' : [
			BASE+'metal/tab-active-r.png',
			BASE+'metal/tab-inactive-r.png',
			BASE+'metal/tab-active-selected-r.png',
			BASE+'metal/tab-inactive-selected-r.png',
			BASE+'metal/shadow-active-r.png',
			BASE+'metal/shadow-inactive-r.png'
		].concat(
			TreeStyleTabUtils.Comparator.compare(TreeStyleTabUtils.XULAppInfo.version, '3.5') >= 0 ?
				[
					BASE+'metal/tab-active-middle.png',
					BASE+'metal/tab-active-middle-selected.png',
					BASE+'metal/tab-inactive-middle.png',
					BASE+'metal/tab-inactive-middle-selected.png'
				] :
				[]
		)
	}
};
