-- Database: creatorFund
USE creatorFund;

-- 1. User
CREATE TABLE IF NOT EXISTS user (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    organization_name VARCHAR(255),
    role ENUM('ADMIN', 'CREATOR', 'DISTRIBUTOR') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. DigitalContent
CREATE TABLE IF NOT EXISTS digital_content (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content_type ENUM('MUSIC', 'VIDEO', 'ARTICLE', 'COURSE', 'PODCAST') NOT NULL,
    description TEXT,
    published_date DATETIME,
    content_status ENUM('DRAFT', 'REGISTERED', 'ACTIVE', 'INACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    created_by BIGINT UNSIGNED NOT NULL,
    price DECIMAL(10,2),
    sales_count INT DEFAULT 0,
    target_qty INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_digitalcontent_user FOREIGN KEY (created_by) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_digitalcontent_status (content_status),
    INDEX idx_digitalcontent_type (content_type)
) ENGINE=InnoDB;

-- 3. ContentRights
CREATE TABLE IF NOT EXISTS content_rights (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    digital_content BIGINT UNSIGNED NOT NULL,
    rights_owner BIGINT UNSIGNED NOT NULL,
    ownership_percentage DECIMAL(10,2) NOT NULL,
    rights_start_date DATETIME NOT NULL,
    rights_end_date DATETIME,
    rights_status ENUM('ACTIVE', 'EXPIRED', 'TRANSFERRED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_ownership_percentage CHECK (ownership_percentage >= 0 AND ownership_percentage <= 100),
    CONSTRAINT fk_contentrights_digitalcontent FOREIGN KEY (digital_content) REFERENCES digital_content(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_contentrights_user FOREIGN KEY (rights_owner) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_contentrights_status (rights_status)
) ENGINE=InnoDB;

-- 4. UsageTransaction
CREATE TABLE IF NOT EXISTS usage_transaction (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    digital_content BIGINT UNSIGNED NOT NULL,
    distributor BIGINT UNSIGNED NOT NULL,
    usage_type ENUM('STREAM', 'DOWNLOAD', 'VIEW', 'SUBSCRIPTION_ACCESS') NOT NULL,
    usage_count INT NOT NULL DEFAULT 1,
    revenue_generated DECIMAL(10,2) NOT NULL,
    transaction_date DATETIME NOT NULL,
    transaction_status ENUM('RECORDED', 'VERIFIED', 'SETTLED') NOT NULL DEFAULT 'RECORDED',
    license_key VARCHAR(255),
    CONSTRAINT fk_usagetransaction_digitalcontent FOREIGN KEY (digital_content) REFERENCES digital_content(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_usagetransaction_user FOREIGN KEY (distributor) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_usagetransaction_status (transaction_status),
    INDEX idx_usagetransaction_date (transaction_date)
) ENGINE=InnoDB;

-- 5. RoyaltyCalculation
CREATE TABLE IF NOT EXISTS royalty_calculation (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    digital_content BIGINT UNSIGNED NOT NULL,
    royalty_owner_id BIGINT UNSIGNED NOT NULL,
    total_revenue DECIMAL(10,2) NOT NULL,
    royalty_percentage DECIMAL(10,2) NOT NULL,
    calculated_amount DECIMAL(10,2) NOT NULL,
    calculation_date DATETIME NOT NULL,
    calculation_status ENUM('PENDING', 'CALCULATED', 'APPROVED') NOT NULL DEFAULT 'PENDING',
    CONSTRAINT chk_royalty_percentage CHECK (royalty_percentage >= 0 AND royalty_percentage <= 100),
    CONSTRAINT fk_royaltycalc_digitalcontent FOREIGN KEY (digital_content) REFERENCES digital_content(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_royaltycalc_user FOREIGN KEY (royalty_owner_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_royaltycalc_status (calculation_status)
) ENGINE=InnoDB;

-- 6. RoyaltyPayment
CREATE TABLE IF NOT EXISTS royalty_payment (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    royalty_calculation BIGINT UNSIGNED NOT NULL,
    paid_amount DECIMAL(10,2) NOT NULL,
    payment_date DATETIME NOT NULL,
    payment_reference VARCHAR(255) NOT NULL UNIQUE,
    payment_status ENUM('INITIATED', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'INITIATED',
    CONSTRAINT fk_royaltypayment_calc FOREIGN KEY (royalty_calculation) REFERENCES royalty_calculation(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_royaltypayment_status (payment_status)
) ENGINE=InnoDB;

-- 7. RightsTransfer
CREATE TABLE IF NOT EXISTS rights_transfer (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    digital_content BIGINT UNSIGNED NOT NULL,
    previous_owner BIGINT UNSIGNED NOT NULL,
    new_owner BIGINT UNSIGNED NOT NULL,
    transfer_date DATETIME NOT NULL,
    transfer_percentage DECIMAL(10,2) NOT NULL,
    CONSTRAINT chk_transfer_percentage CHECK (transfer_percentage >= 0 AND transfer_percentage <= 100),
    CONSTRAINT fk_rightstransfer_digitalcontent FOREIGN KEY (digital_content) REFERENCES digital_content(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rightstransfer_prevowner FOREIGN KEY (previous_owner) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rightstransfer_newowner FOREIGN KEY (new_owner) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
