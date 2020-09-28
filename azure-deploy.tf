# declare variables

variable "subscription_id" {
}
variable "client_id" {
}
variable "client_secret" {
}
variable "tenant_id" {
}
variable "github_pat" {
}
variable "gpr_url" {
}
variable "github_user" {
}

resource "random_string" "suffix" {
  length  = 8
  special = false
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  client_id       = var.client_id
  client_secret   = var.client_secret
  tenant_id       = var.tenant_id
}

resource "azurerm_resource_group" "group" {
  name     = "octocat-generator"
  location = "westeurope"
}

# Create an App Service Plan with Linux
resource "azurerm_app_service_plan" "appserviceplan" {
  name                = "${azurerm_resource_group.group.name}-plan"
  location            = azurerm_resource_group.group.location
  resource_group_name = azurerm_resource_group.group.name

  # Define Linux as Host OS
  kind     = "Linux"
  reserved = true

  # Choose size
  sku {
    tier = "Standard"
    size = "S1"
  }
}

# Create an Azure Web App for Containers in that App Service Plan
resource "azurerm_app_service" "dockerapp" {
  name                = "${azurerm_resource_group.group.name}-web"
  location            = azurerm_resource_group.group.location
  resource_group_name = azurerm_resource_group.group.name
  app_service_plan_id = azurerm_app_service_plan.appserviceplan.id

  # Do not attach Storage by default
  app_settings = {
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = false


    # Settings for private Container Registires  
    DOCKER_REGISTRY_SERVER_URL      = "docker.pkg.github.com"
    DOCKER_REGISTRY_SERVER_USERNAME = var.github_user
    DOCKER_REGISTRY_SERVER_PASSWORD = var.github_pat
  }

  # Configure Docker Image to load on start
  site_config {
    linux_fx_version = "DOCKER|${var.gpr_url}"
    always_on        = "true"
  }

  identity {
    type = "SystemAssigned"
  }
}
