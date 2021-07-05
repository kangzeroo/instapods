
# variable "environment_stage" {
#     type = "string"
#     default = "staging"
# }
# variable "project_id" {
#     type = "string"
#     default = "the-instapods-app-stagin-20131"
# }

# output "ip" {
#   value = google_compute_address.vm_static_ip.address
# }

# provider "google" {
#   version = "3.5.0"

#   credentials = file("./envs/${var.environment_stage}/instapods-infradeploy.json")

#   project = "${var.project_id}"
#   region  = "us-central1"
#   zone    = "us-central1-c"
# }

# resource "google_compute_network" "vpc_network" {
#   name = "terraform-network"
# }

# resource "google_compute_instance" "vm_instance" {
#   name         = "terraform-instance"
#   machine_type = "f1-micro"
#   tags         = ["web", "dev"]

#   boot_disk {
#     initialize_params {
#       image = "cos-cloud/cos-stable"
#     }
#   }

#   provisioner "local-exec" {
#     command = "echo ${google_compute_instance.vm_instance.name}:  ${google_compute_instance.vm_instance.network_interface[0].access_config[0].nat_ip} >> ip_address.txt"
#   }

#   network_interface {
#     network = google_compute_network.vpc_network.name
#     access_config {
#       nat_ip = google_compute_address.vm_static_ip.address
#     }
#   }
# }

# resource "google_compute_address" "vm_static_ip" {
#   name = "terraform-static-ip"
# }

# # New resource for the storage bucket our application will use.
# resource "google_storage_bucket" "example_bucket" {
#   name     = "instapods-staging-bucket-sandbox"
#   location = "US"

#   website {
#     main_page_suffix = "index.html"
#     not_found_page   = "404.html"
#   }
# }
