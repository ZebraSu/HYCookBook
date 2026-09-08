Component({
  properties: { dishId: String, name: String, quantity: { type: Number, value: 0 } },
  methods: {
    change(event) {
      const delta = Number(event.currentTarget.dataset.delta);
      if ((delta < 0 && this.data.quantity <= 0) || (delta > 0 && this.data.quantity >= 99)) return;
      this.triggerEvent('change', { id: this.data.dishId, delta });
    }
  }
});
