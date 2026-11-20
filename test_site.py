import os
import sys
import time
import subprocess
from playwright.sync_api import sync_playwright

project_dir = os.path.dirname(os.path.abspath(__file__))

def run_tests():
    # Start local http server
    server = subprocess.Popen(
        [sys.executable, "-m", "http.server", "8089"],
        cwd=project_dir,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    time.sleep(1.5)

    try:
        with sync_playwright() as p:
            # 1. Desktop Test
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={"width": 1366, "height": 850})
            
            console_errors = []
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
            page.on("pageerror", lambda err: console_errors.append(str(err)))

            print("Navigating to http://localhost:8089 ...")
            page.goto("http://localhost:8089", wait_until="networkidle")

            # Check header and brand
            brand_title = page.locator(".brand-title").inner_text()
            print(f"Brand title: {brand_title}")
            assert "5 ЧУВСТВ" in brand_title, "Brand title not found"

            # Check categories rendered
            chips = page.locator(".category-chip")
            chips_count = chips.count()
            print(f"Categories count: {chips_count}")
            assert chips_count >= 7, "Categories not rendered"

            # Click second category (Coffee)
            page.locator(".category-chip[data-id='coffee']").click()
            time.sleep(0.5)

            # Test search
            search_input = page.locator("#searchInput")
            search_input.fill("капучино")
            time.sleep(0.5)
            assert page.locator(".dish-card").count() >= 1, "Search for капучино failed"
            page.locator("#searchClearBtn").click()
            time.sleep(0.5)

            # Click "+ Выбрать" on first coffee to open modifier modal
            first_add_btn = page.locator(".dish-card[data-id='cappuccino'] .btn-card-add")
            first_add_btn.click()
            time.sleep(0.5)

            # Check modal is open
            assert page.locator("#productModalOverlay").is_visible(), "Product modal not open"
            modal_title = page.locator("#modalProductTitle").inner_text()
            print(f"Opened modal for: {modal_title}")

            # Select Oat Milk (+60 ₽)
            oat_milk = page.locator(".modifier-option-item[data-name*='Овсяное']")
            if oat_milk.count() > 0:
                oat_milk.click()
                time.sleep(0.2)

            # Add to cart from modal
            page.locator("#btnModalAddToCart").click()
            time.sleep(0.5)

            # Verify cart item in sidebar
            cart_items = page.locator(".cart-item-row")
            print(f"Cart items in sidebar: {cart_items.count()}")
            assert cart_items.count() >= 1, "Item not added to cart"

            # Test ticket coupon click
            page.locator("#btnApplyPromo15").click()
            time.sleep(0.5)
            assert page.locator("#cartPromoAppliedBadge").is_visible(), "Promo badge not visible"

            # Click Checkout
            page.locator("#btnSidebarCheckout").click()
            time.sleep(0.5)
            assert page.locator("#checkoutModalOverlay").is_visible(), "Checkout modal not visible"

            # Fill name and phone
            page.locator("#orderClientName").fill("Тестовый Клиент")
            page.locator("#orderClientPhone").fill("+7 (918) 777-66-55")
            
            # Submit order
            page.locator("#btnSubmitFinalOrder").click()
            time.sleep(0.8)

            # Check Order Tracker is visible
            assert page.locator("#orderTrackerModalOverlay").is_visible(), "Tracker modal not visible"
            tracker_status = page.locator("#trackerStatusHeading").inner_text()
            print(f"Tracker status: {tracker_status}")

            # Close tracker
            page.locator("#btnTrackerModalClose").click()
            time.sleep(0.5)

            # Take desktop screenshot
            page.screenshot(path=os.path.join(project_dir, "screenshot_desktop.png"), full_page=False)
            print("Desktop screenshot saved.")

            browser.close()

            # 2. Mobile Viewport Test
            browser_mobile = p.chromium.launch(headless=True)
            context = browser_mobile.new_context(
                viewport={"width": 390, "height": 844},
                user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
            )
            page_m = context.new_page()
            page_m.goto("http://localhost:8089", wait_until="networkidle")

            # Check mobile bottom nav
            assert page_m.locator("#mobileBottomNav").is_visible(), "Mobile bottom nav not visible"

            # Add an item to test floating bar
            page_m.locator(".dish-card[data-id='syrniki-berry'] .btn-card-add").click()
            time.sleep(0.5)

            # Close modifier modal
            page_m.locator("#btnModalAddToCart").click()
            time.sleep(0.5)

            assert page_m.locator("#mobileFloatCartBar").is_visible(), "Mobile float cart not visible"
            page_m.screenshot(path=os.path.join(project_dir, "screenshot_mobile.png"), full_page=False)
            print("Mobile screenshot saved.")

            browser_mobile.close()

            print(f"Console errors count: {len(console_errors)}")
            if console_errors:
                print("Errors:", console_errors)
            assert len(console_errors) == 0, "There were console errors!"
            print("ALL 10 TESTS PASSED WITH 0 CONSOLE ERRORS!")

    finally:
        server.terminate()

if __name__ == "__main__":
    run_tests()
