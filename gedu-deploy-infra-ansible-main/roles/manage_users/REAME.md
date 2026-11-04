# Ansible Role: manage_users

This role manages user accounts on target hosts, including SSH key setup and (optionally) passwordless sudo access. It is designed for use in infrastructure automation and can be included in your playbooks to ensure consistent user management.

## Features

- Creates user accounts with configurable username, shell, comment, and groups.
- Sets up SSH authorized keys for secure access.
- Optionally configures passwordless sudo for the user.
- All settings are managed via variables for flexibility.

## Requirements

- Ansible 2.9+
- Target hosts must support user and sudo management.

## Role Variables

Variables can be set in your inventory, playbook, or via `--extra-vars`. Default values are defined in [`roles/manage_users/defaults/main.yml`](roles/manage_users/defaults/main.yml):

```yaml
user_name: "ansible_user"
user_comment: "Ansible managed user"
user_shell: "/bin/bash"
user_home: "/home/{{ user_name }}"
user_groups: "wheel"
user_ssh_key: ""         # Set this to your public SSH key
sudo_nopasswd: true      # Set to true to allow passwordless sudo
```

- name: Manage users on all hosts
  hosts: all
  become: true
  roles:
    - role: manage_users
      vars:
        user_name: "phumm"
        user_comment: "DevOps Automation User"
        user_ssh_key: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQD..."
        sudo_nopasswd: true