from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import uuid

driver = webdriver.Chrome(executable_path="C:\\Users\\brend\\Downloads\\chromedriver_win32\\chromedriver")
driver.implicitly_wait(10)

acc_1 = {
    "username": "user1337",
    "password": "l33t",
    "id": 25
}

acc_2 = {
    "username": "user1338",
    "password": "user1338",
    "id": 71
}

message = f"uuid sent by selenium: {uuid.uuid1()}"


def login(driver, user):
    driver.get("http://localhost:3000/login")

    username_input = driver.find_element(By.ID, "username")
    username_input.send_keys(user.get("username"))

    pw_input = driver.find_element(By.ID, "password")
    pw_input.send_keys(user.get("password"))

    # login, explicitly wait for login process to finish
    pw_input.send_keys(Keys.ENTER)

    WebDriverWait(driver, 10).until(
        EC.url_to_be("http://localhost:3000/")
    )


def send_msg(driver, recipient, message):

    driver.get(f"http://localhost:3000/users/{recipient.get('id')}")

    send_msg_btn = driver.find_element(By.ID, "send-message")
    send_msg_btn.click()

    subject_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "subject"))
    )

    message_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "message"))
    )

    subject_input.send_keys("selenium")
    message_input.send_keys(message)

    send_btn = driver.find_element(By.CSS_SELECTOR, "#root > div > div > div > div.sc-hKgILt.hyPKlo > button")
    send_btn.click()


def logout():
    logout_btn = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "#root > div > div > div > nav > div > div > div > a.sc-eJMQSu.cIoNGU")))
    logout_btn.click()


def verify_msg(msg):
    driver.get(f"http://localhost:3000/inbox/")
    msg_elem = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".message")))
    msg_elem.click()

    message_body = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "#root > div > div > div > div.sc-cOajty.fYjGoF > p"))
    )

    print(message_body.text)

    assert message_body.text == msg, f"Expected body from automated message to be {message}, got {msg}"

    print("test passed!")
    driver.quit()

login(driver, acc_1)
send_msg(driver, acc_2, message)
logout()
login(driver, acc_2)
verify_msg(message)