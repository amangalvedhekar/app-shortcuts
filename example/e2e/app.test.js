describe('Example app', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('shows the home screen', async () => {
    await expect(element(by.text('Home'))).toBeVisible();
    await expect(element(by.text('Manage shortcuts'))).toBeVisible();
  });
});
