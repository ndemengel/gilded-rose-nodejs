var expect = require('chai').expect;
var Inn = require('../');

describe('Gilded Rose', function () {

  var DEXTERITY_VEST_IDX = 0;
  var BRIE_IDX = 1;
  var MANGOOSE_ELIXIR_IDX = 2;
  var SULFURAS_IDX = 3;
  var BACKSTAGE_PASSES_IDX = 4;
  var CONJURED_MANA_CAKE_IDX = 5;
  var CONJURED_MUFFIN_IDX = 6;

  var inn;

  beforeEach(function () {
    inn = new Inn();
  });

  it('should_not_change_quality_nor_sellIn_for_sulfuras', function () {
    // when
    inn.updateQuality();

    // then
    expect(sulfuras().quality).to.equal(80);
    expect(sulfuras().sellIn).to.equal(0);

    // once again
    makeALongTimePass();

    // then
    expect(sulfuras().quality).to.equal(80);
    expect(sulfuras().sellIn).to.equal(0);
  });

  it('should_decrease_sellIn_for_all_products_but_sulfuras', function () {
    // when
    inn.updateQuality();

    // then
    expect(dexterityVest().sellIn).to.equal(9);
    expect(brie().sellIn).to.equal(1);
    expect(mangooseElixir().sellIn).to.equal(4);
    expect(backstagePasses().sellIn).to.equal(14);
    expect(conjuredManaCake().sellIn).to.equal(2);

    // once again
    inn.updateQuality();

    // then
    expect(dexterityVest().sellIn).to.equal(8);
    expect(brie().sellIn).to.equal(0);
    expect(mangooseElixir().sellIn).to.equal(3);
    expect(backstagePasses().sellIn).to.equal(13);
    expect(conjuredManaCake().sellIn).to.equal(1);
  });

  it('should_decrease_quality_for_general_products', function () {
    // when
    inn.updateQuality();

    // then
    expect(dexterityVest().quality).to.equal(19);
    expect(mangooseElixir().quality).to.equal(6);

    // once again
    inn.updateQuality();

    // then
    expect(dexterityVest().quality).to.equal(18);
    expect(mangooseElixir().quality).to.equal(5);
  });

  it('should_increase_quality_for_brie_and_backstage_pass', function () {
    // when
    inn.updateQuality();

    // then
    expect(brie().quality).to.equal(1);
    expect(backstagePasses().quality).to.equal(21);
  });

  it('should_decrease_quality_twice_for_general_products_when_sell_by_date_has_passed', function () {
    [DEXTERITY_VEST_IDX, MANGOOSE_ELIXIR_IDX, CONJURED_MANA_CAKE_IDX].forEach(function (itemIdx) {
      // given
      var item = inn.items[itemIdx];

      moveToLastDayBeforeSellByDate(item);

      var qualityBeforeUpdate = item.quality;

      // when
      inn.updateQuality();

      // then
      var expectedQuantities = [qualityBeforeUpdate - 2, 0];

      expect(item.quality).to.satisfy(function (q) {
        return expectedQuantities.indexOf(q) !== -1;
      }, 'quality of ' + item.name + ' was expected to be one of ' + expectedQuantities) + ' but was ' + item.quality;
    });
  });

  it('should_never_set_quality_below_0', function () {
    makeALongTimePass();

    inn.items.forEach(function (item) {
      expect(item.quality).to.be.at.least(0);
    });
  });

  it('should_never_set_quality_above_50_except_for_sulfuras', function () {
    makeALongTimePass();

    inn.items.forEach(function (item) {
      if (item !== sulfuras()) {
        expect(item.quality).to.be.at.most(50);
      }
    });
  });

  it('should_increase_brie_quality_by_2_when_sell_by_date_is_passed', function () {
    // given
    moveToLastDayBeforeSellByDate(brie());

    var qualityBeforeUpdate = brie().quality;

    // when
    inn.updateQuality();

    // then
    expect(brie().quality).to.equal(qualityBeforeUpdate + 2);
  });

  it('should_increase_backstage_passes_quality_by_2_when_concert_is_in_10_days_or_less', function () {
    // given
    moveToNthDayBeforeSellByDate(backstagePasses(), 10);

    var qualityBeforeUpdate = backstagePasses().quality;

    // when
    inn.updateQuality();

    // then
    expect(backstagePasses().quality).to.equal(qualityBeforeUpdate + 2);
  });

  it('should_increase_backstage_passes_quality_by_3_when_concert_is_in_5_days_or_less', function () {
    // given
    moveToNthDayBeforeSellByDate(backstagePasses(), 5);

    var qualityBeforeUpdate = backstagePasses().quality;

    // when
    inn.updateQuality();

    // then
    expect(backstagePasses().quality).to.equal(qualityBeforeUpdate + 3);
  });

  it('should_decrease_quality_twice_as_fast_for_conjured_items', function () {
    // when
    inn.updateQuality();

    // then
    expect(conjuredManaCake().quality).to.equal(4);
    expect(conjuredMuffin().quality).to.equal(3);

    // once again
    inn.updateQuality();

    // then
    expect(conjuredManaCake().quality).to.equal(2);
    expect(conjuredMuffin().quality).to.equal(1);
  });

  function makeALongTimePass() {
    for (var i = 0; i < 200; i++) {
      inn.updateQuality();
    }
  }

  function moveToLastDayBeforeSellByDate(item) {
    moveToNthDayBeforeSellByDate(item, 1);
  }

  function moveToNthDayBeforeSellByDate(item, n) {
    var limit = item.sellIn - n + 1;
    for (var i = 0; i < limit; i++) {
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
