
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import NavPillsStackedListView from '../ui/navPillsStacked';
import SearchInput from '../ui/form/searchInput';
import template from '../../templates/contribColumn.ejs';


export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {},
    },

    regions: {
        'searchInput': '.rg_search_input',
        'presetsNav': '.rg_presets_nav',
        'freeAdditionNav': '.rg_free_addition_nav',
    },

    ui: {
        'column': '#contrib_column',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    open() {
        this.render();
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    setCenter( center ) {
        this._center = center;
    },

    onRender() {
        const searchInput = new SearchInput({
            placeholder: document.l10n.getSync('contribColumn_searchAPreset'),
        });

        this.getRegion('searchInput').show( searchInput );

        // searchInput.on('empty', this.resetThemeCollection, this);
        // searchInput.on('notEnoughCharacters', this.showCharactersLeftPlaceholder, this);
        // searchInput.on('search', this.fetchSearchedThemes, this);
        searchInput.setFocus();

        const presetNavItems = [];
        const presetsNav = new NavPillsStackedListView();
        const freeAdditionNav = new NavPillsStackedListView();
        const presetModels = this.options.theme.get('presets').models;

        for (const key in presetModels) {
            if (presetModels.hasOwnProperty(key)) {
                presetNavItems.push({
                    'label': presetModels[key].get('name'),
                    'description': presetModels[key].get('description'),
                    'callback': this._radio.commands.execute.bind(
                        this._radio.commands,
                        'column:showContribForm',
                        {
                            'presetModel': presetModels[key],
                            'center': this._center,
                        }
                    )
                });
            }
        }

        const defaultIDPresets = this.options.iDPresetsHelper.getDefaultPoints();

        for (const iDPreset of defaultIDPresets) {
            presetNavItems.push({
                'label': iDPreset.name,
                // 'callback': this._radio.commands.execute.bind(
                //     this._radio.commands,
                //     'column:showContribForm',
                //     {
                //         'presetModel': presetModels[key],
                //         'center': this._center,
                //     }
                // )
            });
        }

        presetsNav.setItems(presetNavItems);

        freeAdditionNav.setItems([{
            'label': document.l10n.getSync('contribColumn_freeAddition'),
            'callback': this._radio.commands.execute.bind(
                this._radio.commands,
                'column:showContribForm',
                {
                    'center': this._center,
                }
            )
        }]);

        this.getRegion('presetsNav').show( presetsNav );
        this.getRegion('freeAdditionNav').show( freeAdditionNav );
    },
});
