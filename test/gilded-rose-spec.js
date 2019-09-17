const Inn = require('../');

describe('Gilded Rose', () => {

    const DEXTERITY_VEST_IDX = 0;
    const BRIE_IDX = 1;
    const MANGOOSE_ELIXIR_IDX = 2;
    const SULFURAS_IDX = 3;
    const BACKSTAGE_PASSES_IDX = 4;
    const CONJURED_MANA_CAKE_IDX = 5;
    const CONJURED_MUFFIN_IDX = 6;

    let inn;

    beforeEach(() => {
        inn = new Inn();
    });

    it('should not change quality nor sellIn for sulfuras', () => {
        // when
        inn.updateQuality();

        // then
        expect(sulfuras().quality).toEqual(80);
        expect(sulfuras().sellIn).toEqual(0);

        // once again
        makeALongTimePass();

        // then
        expect(sulfuras().quality).toEqual(80);
        expect(sulfuras().sellIn).toEqual(0);
    });

    it('should decrease sellIn for all products but sulfuras', () => {
        // when
        inn.updateQuality();

        // then
        expect(dexterityVest().sellIn).toEqual(9);
        expect(brie().sellIn).toEqual(1);
        expect(mangooseElixir().sellIn).toEqual(4);
        expect(backstagePasses().sellIn).toEqual(14);
        expect(conjuredManaCake().sellIn).toEqual(2);

        // once again
        inn.updateQuality();

        // then
        expect(dexterityVest().sellIn).toEqual(8);
        expect(brie().sellIn).toEqual(0);
        expect(mangooseElixir().sellIn).toEqual(3);
        expect(backstagePasses().sellIn).toEqual(13);
        expect(conjuredManaCake().sellIn).toEqual(1);
    });

    it('should decrease quality for general products', () => {
        // when
        inn.updateQuality();

        // then
        expect(dexterityVest().quality).toEqual(19);
        expect(mangooseElixir().quality).toEqual(6);

        // once again
        inn.updateQuality();

        // then
        expect(dexterityVest().quality).toEqual(18);
        expect(mangooseElixir().quality).toEqual(5);
    });

    it('should increase quality for brie and backstage pass', () => {
        // when
        inn.updateQuality();

        // then
        expect(brie().quality).toEqual(1);
        expect(backstagePasses().quality).toEqual(21);
    });

    it('should decrease quality twice for general products when sell by date has passed', () => {
        [DEXTERITY_VEST_IDX, MANGOOSE_ELIXIR_IDX, CONJURED_MANA_CAKE_IDX].forEach(itemIdx => {
            // given
            const item = inn.items[itemIdx];

            moveToLastDayBeforeSellByDate(item);

            const qualityBeforeUpdate = item.quality;

            // when
            inn.updateQuality();

            // then
            const expectedQuantities = [qualityBeforeUpdate - 2, 0];

            expect(expectedQuantities).toContain(item.quality);
        });
    });

    it('should never set quality below 0', () => {
        makeALongTimePass();

        inn.items.forEach(item => {
            expect(item.quality).toBeGreaterThanOrEqual(0);
        });
    });

    it('should never set quality above 50 except for sulfuras', () => {
        makeALongTimePass();

        inn.items.forEach(item => {
            if (item !== sulfuras()) {
                expect(item.quality).toBeLessThanOrEqual(50);
            }
        });
    });

    it('should increase brie quality by 2 when sell by date is passed', () => {
        // given
        moveToLastDayBeforeSellByDate(brie());

        const qualityBeforeUpdate = brie().quality;

        // when
        inn.updateQuality();

        // then
        expect(brie().quality).toEqual(qualityBeforeUpdate + 2);
    });

    it('should increase backstage passes quality by 2 when concert is in 10 days or less', () => {
        // given
        moveToNthDayBeforeSellByDate(backstagePasses(), 10);

        const qualityBeforeUpdate = backstagePasses().quality;

        // when
        inn.updateQuality();

        // then
        expect(backstagePasses().quality).toEqual(qualityBeforeUpdate + 2);
    });

    it('should increase backstage passes quality by 3 when concert is in 5 days or less', () => {
        // given
        moveToNthDayBeforeSellByDate(backstagePasses(), 5);

        const qualityBeforeUpdate = backstagePasses().quality;

        // when
        inn.updateQuality();

        // then
        expect(backstagePasses().quality).toEqual(qualityBeforeUpdate + 3);
    });

    it('should decrease quality twice as fast for conjured items', () => {
        // when
        inn.updateQuality();

        // then
        expect(conjuredManaCake().quality).toEqual(4);
        expect(conjuredMuffin().quality).toEqual(3);

        // once again
        inn.updateQuality();

        // then
        expect(conjuredManaCake().quality).toEqual(2);
        expect(conjuredMuffin().quality).toEqual(1);
    });

    function makeALongTimePass() {
        for (let i = 0; i < 200; i++) {
            inn.updateQuality();
        }
    }

    function moveToLastDayBeforeSellByDate(item) {
        moveToNthDayBeforeSellByDate(item, 1);
    }

    function moveToNthDayBeforeSellByDate(item, n) {
        const limit = item.sellIn - n + 1;
        for (let i = 0; i < limit; i++) {
            inn.updateQuality();
        }
    }

    function dexterityVest() {
        return inn.items[DEXTERITY_VEST_IDX];
    }

    function brie() {
        return inn.items[BRIE_IDX];
    }

    function mangooseElixir() {
        return inn.items[MANGOOSE_ELIXIR_IDX];
    }

    function sulfuras() {
        return inn.items[SULFURAS_IDX];
    }

    function backstagePasses() {
        return inn.items[BACKSTAGE_PASSES_IDX];
    }

    function conjuredManaCake() {
        return inn.items[CONJURED_MANA_CAKE_IDX];
    }

    function conjuredMuffin() {
        return inn.items[CONJURED_MUFFIN_IDX];
    }
});
