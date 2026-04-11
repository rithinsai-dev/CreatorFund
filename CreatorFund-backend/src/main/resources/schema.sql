-- Database: creatorFund
USE creatorFund;

-- 1. User
CREATE TABLE IF NOT EXISTS User (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    organizationName VARCHAR(255),
    role ENUM('ADMIN', 'CREATOR', 'DISTRIBUTOR') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. DigitalContent
CREATE TABLE IF NOT EXISTS DigitalContent (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    contentType ENUM('MUSIC', 'VIDEO', 'ARTICLE', 'COURSE', 'PODCAST') NOT NULL,
    description TEXT,
    publishedDate DATETIME,
    contentStatus ENUM('DRAFT', 'REGISTERED', 'ACTIVE', 'INACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    createdBy BIGINT UNSIGNED NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_digitalcontent_user FOREIGN KEY (createdBy) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_digitalcontent_status (contentStatus),
    INDEX idx_digitalcontent_type (contentType)
) ENGINE=InnoDB;

-- 3. ContentRights
CREATE TABLE IF NOT EXISTS ContentRights (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    digitalContent BIGINT UNSIGNED NOT NULL,
    rightsOwner BIGINT UNSIGNED NOT NULL,
    ownershipPercentage DECIMAL(10,2) NOT NULL,
    rightsStartDate DATETIME NOT NULL,
    rightsEndDate DATETIME,
    rightsStatus ENUM('ACTIVE', 'EXPIRED', 'TRANSFERRED') NOT NULL DEFAULT 'ACTIVE',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_ownership_percentage CHECK (ownershipPercentage >= 0 AND ownershipPercentage <= 100),
    CONSTRAINT fk_contentrights_digitalcontent FOREIGN KEY (digitalContent) REFERENCES DigitalContent(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_contentrights_user FOREIGN KEY (rightsOwner) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_contentrights_status (rightsStatus)
) ENGINE=InnoDB;

-- 4. UsageTransaction
CREATE TABLE IF NOT EXISTS UsageTransaction (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    digitalContent BIGINT UNSIGNED NOT NULL,
    distributor BIGINT UNSIGNED NOT NULL,
    usageType ENUM('STREAM', 'DOWNLOAD', 'VIEW', 'SUBSCRIPTION_ACCESS') NOT NULL,
    usageCount INT NOT NULL DEFAULT 1,
    revenueGenerated DECIMAL(10,2) NOT NULL,
    transactionDate DATETIME NOT NULL,
    transactionStatus ENUM('RECORDED', 'VERIFIED', 'SETTLED') NOT NULL DEFAULT 'RECORDED',
    CONSTRAINT fk_usagetransaction_digitalcontent FOREIGN KEY (digitalContent) REFERENCES DigitalContent(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_usagetransaction_user FOREIGN KEY (distributor) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_usagetransaction_status (transactionStatus),
    INDEX idx_usagetransaction_date (transactionDate)
) ENGINE=InnoDB;

-- 5. RoyaltyCalculation
CREATE TABLE IF NOT EXISTS RoyaltyCalculation (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    digitalContent BIGINT UNSIGNED NOT NULL,
    totalRevenue DECIMAL(10,2) NOT NULL,
    royaltyPercentage DECIMAL(10,2) NOT NULL,
    calculatedAmount DECIMAL(10,2) NOT NULL,
    calculationDate DATETIME NOT NULL,
    calculationStatus ENUM('PENDING', 'CALCULATED', 'APPROVED') NOT NULL DEFAULT 'PENDING',
    CONSTRAINT chk_royalty_percentage CHECK (royaltyPercentage >= 0 AND royaltyPercentage <= 100),
    CONSTRAINT fk_royaltycalc_digitalcontent FOREIGN KEY (digitalContent) REFERENCES DigitalContent(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_royaltycalc_status (calculationStatus)
) ENGINE=InnoDB;

-- 6. RoyaltyPayment
CREATE TABLE IF NOT EXISTS RoyaltyPayment (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    royaltyCalculation BIGINT UNSIGNED NOT NULL,
    paidAmount DECIMAL(10,2) NOT NULL,
    paymentDate DATETIME NOT NULL,
    paymentReference VARCHAR(255) NOT NULL UNIQUE,
    paymentStatus ENUM('INITIATED', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'INITIATED',
    CONSTRAINT fk_royaltypayment_calc FOREIGN KEY (royaltyCalculation) REFERENCES RoyaltyCalculation(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_royaltypayment_status (paymentStatus)
) ENGINE=InnoDB;

-- 7. RightsTransfer
CREATE TABLE IF NOT EXISTS RightsTransfer (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    digitalContent BIGINT UNSIGNED NOT NULL,
    previousOwner BIGINT UNSIGNED NOT NULL,
    newOwner BIGINT UNSIGNED NOT NULL,
    transferDate DATETIME NOT NULL,
    transferPercentage DECIMAL(10,2) NOT NULL,
    CONSTRAINT chk_transfer_percentage CHECK (transferPercentage >= 0 AND transferPercentage <= 100),
    CONSTRAINT fk_rightstransfer_digitalcontent FOREIGN KEY (digitalContent) REFERENCES DigitalContent(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rightstransfer_prevowner FOREIGN KEY (previousOwner) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rightstransfer_newowner FOREIGN KEY (newOwner) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
