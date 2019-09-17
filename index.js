class Item {
    constructor(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

module.exports = class Inn {
    constructor() {
        this.items = [];

        this.items.push(new Item('+5 Dexterity Vest', 10, 20));
        this.items.push(new Item('Aged Brie', 2, 0));
        this.items.push(new Item('Elixir of the Mongoose', 5, 7));
        this.items.push(new Item('Sulfuras, Hand of Ragnaros', 0, 80));
        this.items.push(new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20));
        this.items.push(new Item('Conjured Mana Cake', 3, 6));
        this.items.push(new Item('Conjured Muffin', 1, 5));
    }

    updateQuality() {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].name !== 'Aged Brie' && this.items[i].name !== 'Backstage passes to a TAFKAL80ETC concert') {
                if (this.items[i].quality > 0) {
                    if (this.items[i].name !== 'Sulfuras, Hand of Ragnaros') {
                        this.items[i].quality = this.items[i].quality - 1
                    }
                }
            } else {
                if (this.items[i].quality < 50) {
                    this.items[i].quality = this.items[i].quality + 1;
                    if (this.items[i].name === 'Backstage passes to a TAFKAL80ETC concert') {
                        if (this.items[i].sellIn < 11) {
                            if (this.items[i].quality < 50) {
                                this.items[i].quality = this.items[i].quality + 1
                            }
                        }
                        if (this.items[i].sellIn < 6) {
                            if (this.items[i].quality < 50) {
                                this.items[i].quality = this.items[i].quality + 1
                            }
                        }
                    }
                }
            }
            if (this.items[i].name !== 'Sulfuras, Hand of Ragnaros') {
                this.items[i].sellIn = this.items[i].sellIn - 1;
            }
            if (this.items[i].sellIn < 0) {
                if (this.items[i].name !== 'Aged Brie') {
                    if (this.items[i].name !== 'Backstage passes to a TAFKAL80ETC concert') {
                        if (this.items[i].quality > 0) {
                            if (this.items[i].name !== 'Sulfuras, Hand of Ragnaros') {
                                this.items[i].quality = this.items[i].quality - 1
                            }
                        }
                    } else {
                        this.items[i].quality = this.items[i].quality - this.items[i].quality
                    }
                } else {
                    if (this.items[i].quality < 50) {
                        this.items[i].quality = this.items[i].quality + 1
                    }
                }
            }
        }
    }
};
