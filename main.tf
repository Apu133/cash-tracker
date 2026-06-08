provider "aws" {
    region = "ap-south-2"
}

data "aws_vpc" "default_vpc" {
  default = true
}
data "aws_subnets" "default_subnets" {
    filter {
      name = "vpc-id"
      values = [data.aws_vpc.default_vpc.id]
    }
    filter {
        name   = "default-for-az"
        values = ["true"]
    }
}

resource "aws_security_group" "ec2_sg" {
    name = "ec2_sg"
    description = "Security group for EC2 instance"
    vpc_id = data.aws_vpc.default_vpc.id

    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port = 80
        to_port = 80
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port = 8080
        to_port = 8080
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port = 3000
        to_port = 3000
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port = 5000
        to_port = 5000
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_instance" "ec2" {
    ami = "ami-09aa82e803f05d496"
    instance_type = "t3.small"

    root_block_device {
        volume_size = 30
        volume_type = "gp2"   # gp2 is free tier eligible
    }

    key_name = "ubuntu-key-pair"
    subnet_id = tolist(data.aws_subnets.default_subnets.ids)[0]
    

    vpc_security_group_ids = [aws_security_group.ec2_sg.id]

    user_data = file("install.sh")
}
resource "aws_eip" "elastic_ip" {
    domain = "vpc"
}
resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.ec2.id
  allocation_id = aws_eip.elastic_ip.id
}


output "elastic_ip_address" {
    value = aws_eip.elastic_ip.public_ip
}

output "ip_address" {
    value = aws_instance.ec2.public_ip
}